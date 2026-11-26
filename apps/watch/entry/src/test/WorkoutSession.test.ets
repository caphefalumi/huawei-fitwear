import { describe, expect, it } from '@ohos/hypium';
import {
  DayInfo,
  encodeFrames,
  FavoriteMeal,
  FrameAssembler,
  mergeSessions,
  SharedSession,
  SyncMessage,
  WorkoutPlan,
} from '../main/ets/features/link/SyncProtocol';
import { FoodDay, isoDay } from '../main/ets/features/quicklog/FoodDay';
import { encodeState, restoreState } from '../main/ets/features/storage/SavedState';
import {
  IDLE_ANSWER_MS,
  IDLE_PROMPT_MS,
  TickEvent,
  WorkoutPhase,
  WorkoutSession,
  WorkoutStatus,
} from '../main/ets/features/workout/WorkoutSession';

const PLAN: WorkoutPlan = {
  name: 'Push',
  minutes: 10,
  exercises: [
    { key: 'a', name: 'A', sets: 2, reps: 3, unit: 'reps', rest: 60, superset: '' },
    { key: 'b', name: 'B', sets: 1, reps: 3, unit: 'reps', rest: 60, superset: '' },
  ],
};

const SUPERSET: WorkoutPlan = {
  name: 'Pair',
  minutes: 5,
  exercises: [
    { key: 'a', name: 'A', sets: 2, reps: 3, unit: 'reps', rest: 30, superset: 'p' },
    { key: 'b', name: 'B', sets: 2, reps: 3, unit: 'reps', rest: 30, superset: 'p' },
  ],
};

/** The same frame is asserted by apps/mobile's protocol test. */
const FIXTURE_FRAME: string = '~7.0.1~{"t":"welcome","v":1,"ok":true}';

const RICE: FavoriteMeal = {
  ref: 'm1',
  name: 'Rice',
  kcal: 500,
  protein: 10,
  carbs: 20,
  fat: 5,
};

function info(date: string, applied: string[] = [], owner: string = 'u1'): DayInfo {
  return {
    date: date,
    owner: owner,
    kcalTarget: 2000,
    kcalEaten: 100,
    target: { protein: 100, carbs: 200, fat: 60 },
    eaten: { protein: 1, carbs: 2, fat: 3 },
    favorites: [RICE],
    applied: applied,
  };
}

function emptyDay(now: number = Date.now()): FoodDay {
  return new FoodDay(now);
}

/** A day the phone has sent its figures for. */
function loadedDay(now: number): FoodDay {
  const day = emptyDay(now);
  day.apply(info(isoDay(now)));
  return day;
}

function started(plan: WorkoutPlan = PLAN): WorkoutSession {
  const session = new WorkoutSession(plan);
  session.start(1000, 'one');
  return session;
}

export default function workoutSessionTest() {
  describe('WorkoutSession', () => {
    it('signals the target once and never goes below zero', 0, () => {
      const session = started();
      session.changeReps(-1, 1000);
      expect(session.reps).assertEqual(0);
      expect(session.changeReps(2, 1000)).assertFalse();
      expect(session.changeReps(1, 1000)).assertTrue();
      expect(session.changeReps(1, 1000)).assertFalse();
    });

    it('walks every set then finishes', 0, () => {
      const session = started();
      session.changeReps(3, 1000);
      session.doneSet(2000);
      expect(session.phase).assertEqual(WorkoutPhase.REST);
      expect(session.tick(62000)).assertEqual(TickEvent.REST_OVER);
      session.doneSet(63000);
      expect(session.exerciseIndex).assertEqual(1);
      session.skipRest(64000);
      session.doneSet(121000);
      expect(session.status).assertEqual(WorkoutStatus.DONE);
      expect(session.records.length).assertEqual(3);
      expect(session.exercisesDone).assertEqual(2);
      expect(session.activeMs).assertEqual(120000);
    });

    it('alternates a superset and rests only after each round', 0, () => {
      const session = started(SUPERSET);
      session.doneSet(2000);
      expect(session.exerciseIndex).assertEqual(1);
      expect(session.phase).assertEqual(WorkoutPhase.SET);
      session.doneSet(3000);
      expect(session.exerciseIndex).assertEqual(0);
      expect(session.setIndex).assertEqual(1);
      expect(session.phase).assertEqual(WorkoutPhase.REST);
    });

    it('freezes rest and workout time while paused', 0, () => {
      const session = started();
      session.doneSet(2000);
      session.pause(12000);
      expect(session.tick(100000)).assertEqual(TickEvent.NONE);
      expect(session.restLeftMs).assertEqual(50000);
      session.resume(100000);
      session.tick(110000);
      expect(session.restLeftMs).assertEqual(40000);
      session.end(110000);
      expect(session.activeMs).assertEqual(21000);
    });

    it('keeps finished sets across skip, early end and continue', 0, () => {
      const session = started();
      session.doneSet(2000);
      session.skipExercise(4000);
      expect(session.exerciseIndex).assertEqual(1);
      expect(session.exercisesDone).assertEqual(0);
      session.end(5000);
      expect(session.status).assertEqual(WorkoutStatus.ENDED_EARLY);
      expect(session.records.length).assertEqual(1);
      session.reopen(6000);
      expect(session.status).assertEqual(WorkoutStatus.ACTIVE);
      expect(session.exerciseIndex).assertEqual(1);
    });

    it('asks after idling, then ends without counting the idle time', 0, () => {
      const session = started();
      session.changeReps(1, 5000);
      const asked = 5000 + IDLE_PROMPT_MS;
      expect(session.tick(asked)).assertEqual(TickEvent.STILL_TRAINING);
      expect(session.tick(asked + IDLE_ANSWER_MS)).assertEqual(TickEvent.AUTO_ENDED);
      expect(session.activeMs).assertEqual(4000);
    });
  });

  describe('Sync', () => {
    it('reads the shared fixture and rejects junk', 0, () => {
      expect(new FrameAssembler().push(FIXTURE_FRAME)?.ok).assertTrue();
      expect(new FrameAssembler().push('~1.0.1~{"t":"session"}')).assertUndefined();
      expect(new FrameAssembler().push('VoocHealth Watch Ready')).assertUndefined();
      expect(new FrameAssembler().push('~1.1.2~tail')).assertUndefined();
    });

    it('splits a long message into small frames and rebuilds it', 0, () => {
      const message: SyncMessage = {
        t: 'plan',
        plan: {
          name: 'Đẩy',
          minutes: 10,
          exercises: PLAN.exercises,
        },
      };
      const frames = encodeFrames(message, 20, 3);
      expect(frames.every((frame: string) => frame.length <= 20)).assertTrue();
      const assembler = new FrameAssembler();
      let result: SyncMessage | undefined = undefined;
      frames.forEach((frame: string) => {
        result = assembler.push(frame);
      });
      expect(JSON.stringify(result)).assertEqual(JSON.stringify(message));
    });

    it('mirrors a workout started and trained on the other device', 0, () => {
      const phone = started();
      phone.changeReps(3, 1500);
      phone.doneSet(2000);
      const watch = new WorkoutSession(PLAN);
      const first = mergeSessions(watch.shared(2000), phone.shared(2000) as SharedSession, true);
      expect(first.changed).assertTrue();
      expect(first.reply).assertFalse();
      watch.applyShared(first.session, 12000);
      expect(watch.status).assertEqual(WorkoutStatus.ACTIVE);
      expect(watch.records.length).assertEqual(1);
      expect(watch.phase).assertEqual(WorkoutPhase.REST);
      expect(watch.restLeftMs).assertEqual(60000);
    });

    it('never loses a set when both devices changed, and converges', 0, () => {
      const a = started();
      const b = new WorkoutSession(PLAN);
      b.applyShared(a.shared(1000) as SharedSession, 1000);
      a.doneSet(2000);
      b.skipExercise(2000);
      b.doneSet(3000);
      const merged = mergeSessions(a.shared(4000), b.shared(4000) as SharedSession, false);
      expect(merged.session.log.length).assertEqual(2);
      expect(merged.reply).assertTrue();
      const back = mergeSessions(b.shared(4000), merged.session, true);
      expect(back.reply).assertFalse();
    });

    it('keeps the finish time of a workout synced later', 0, () => {
      const watch = started();
      watch.doneSet(2000);
      watch.end(5000);
      expect(watch.shared(900000)?.end).assertEqual(5000);
    });

    it('closes a workout the phone saved', 0, () => {
      const watch = started();
      const saved = watch.shared(2000) as SharedSession;
      const closed: SharedSession = {
        id: saved.id,
        rev: saved.rev + 1,
        plan: saved.plan,
        status: 'closed',
        at: saved.at,
        end: 3000,
        pos: 0,
        rest: 0,
        log: [],
        skip: [],
      };
      watch.applyShared(mergeSessions(watch.shared(3000), closed, true).session, 3000);
      expect(watch.status).assertEqual(WorkoutStatus.IDLE);
      expect(watch.shared(3000)?.status).assertEqual('closed');
    });
  });

  describe('FoodDay', () => {
    const noon = new Date(2026, 0, 10, 12, 0, 0).getTime();

    it('shows nothing and logs nothing before the phone has sent its figures', 0, () => {
      const day = emptyDay(noon);
      expect(day.hasData).assertFalse();
      expect(day.log(RICE, 'a', noon)).assertFalse();
    });

    it('adds a quick log to the totals and undoes it', 0, () => {
      const day = loadedDay(noon);
      expect(day.log(RICE, 'a', noon)).assertTrue();
      expect(day.kcalEaten).assertEqual(600);
      expect(day.eaten.carbs).assertEqual(22);
      expect(day.waiting(RICE)).assertEqual(1);
      day.undoLast();
      expect(day.kcalEaten).assertEqual(100);
    });

    it('sends a quick log only once it can no longer be undone', 0, () => {
      const day = loadedDay(noon);
      day.log(RICE, 'a', noon);
      expect(day.due(noon + 4000).length).assertEqual(0);
      const due = day.due(noon + 5000);
      expect(due.length).assertEqual(1);
      expect(due[0].ref).assertEqual('m1');
      expect(due[0].owner).assertEqual('u1');
    });

    it('keeps a log until the phone totals include it, without counting it twice', 0, () => {
      const day = loadedDay(noon);
      day.log(RICE, 'a', noon);
      day.apply(info(isoDay(noon)));
      expect(day.kcalEaten).assertEqual(600);
      day.apply(info(isoDay(noon), ['a']));
      expect(day.pending.length).assertEqual(0);
      expect(day.kcalEaten).assertEqual(100);
    });

    it('drops another account logs and yesterday totals', 0, () => {
      const day = loadedDay(noon);
      day.log(RICE, 'a', noon);
      day.apply(info(isoDay(noon), [], 'u2'));
      expect(day.pending.length).assertEqual(0);
      day.today = isoDay(noon + 24 * 60 * 60 * 1000);
      expect(day.kcalEaten).assertEqual(0);
      expect(day.kcalTarget).assertEqual(2000);
    });
  });

  describe('SavedState', () => {
    const noon = new Date(2026, 0, 10, 12, 0, 0).getTime();
    const nextDay = noon + 24 * 60 * 60 * 1000;
    const none: WorkoutPlan = { name: '', minutes: 0, exercises: [] };

    it('restores a workout in progress, its plan and the nutrition figures', 0, () => {
      const session = new WorkoutSession(PLAN);
      const day = emptyDay(noon);
      day.apply(info(isoDay(noon)));
      session.start(noon, 'one');
      session.doneSet(noon + 1000);
      day.log(RICE, 'a', noon);
      const saved = encodeState(session, day, false, noon + 1000);

      const restoredDay = emptyDay(noon);
      const restored = restoreState(saved, none, restoredDay, noon + 11000).session;
      expect(restored.plan.name).assertEqual('Push');
      expect(restored.status).assertEqual(WorkoutStatus.ACTIVE);
      expect(restored.records.length).assertEqual(1);
      expect(restored.paused).assertTrue();
      expect(restored.restLeftMs).assertEqual(50000);
      expect(restoredDay.kcalEaten).assertEqual(600);
    });

    it('brings an interrupted workout back paused and keeps unsent quick logs', 0, () => {
      const session = new WorkoutSession(PLAN);
      const day = emptyDay(noon);
      day.apply(info(isoDay(noon)));
      session.start(noon, 'one');
      session.changeReps(1, noon + 5000);
      day.log(RICE, 'a', noon);
      const saved = encodeState(session, day, false, noon + 5000);

      const restoredDay = emptyDay(nextDay);
      const restored = restoreState(saved, none, restoredDay, nextDay).session;
      expect(restored.status).assertEqual(WorkoutStatus.ACTIVE);
      expect(restored.paused).assertTrue();
      expect(restored.hasProgress).assertTrue();
      expect(restored.activeMs).assertEqual(5000);
      expect(restored.tick(nextDay + 1000)).assertEqual(TickEvent.NONE);
      expect(restoredDay.kcalEaten).assertEqual(0);
      expect(restoredDay.pending.length).assertEqual(1);
    });

    it('ignores damaged data', 0, () => {
      const restored = restoreState('{oops', none, emptyDay(), noon).session;
      expect(restored.status).assertEqual(WorkoutStatus.IDLE);
      expect(restored.plan.exercises.length).assertEqual(0);
    });
  });
}
