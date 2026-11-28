import { describe, expect, it } from '@ohos/hypium';
import {
  DayInfo,
  encodeFrames,
  FavoriteMeal,
  FoodLog,
  FrameAssembler,
  LiveReps,
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
/** Rows written and read the same way by apps/mobile's protocol test. */
const ROW_PLAN_FRAME: string =
  '~8.0.1~["p","k1","Push",10,[["bench-press","Bench press",2,8,0,60,""]]]';
const ROW_SESSION_FRAME: string = '~9.0.1~["s","one",2,"Push",0,1000,0,1,0,[0,0,8],[]]';
const ROW_DAY_FRAME: string =
  '~10.0.1~["d","2026-03-02","u1",2000,[100,200,60],100,[1,2,3],["a"],[["m1","Rice",500,10,20,5]]]';
const ROW_FOOD_FRAME: string = '~11.0.1~["f",[["log-1","m1","u1",1000]]]';
const ROW_REPS_FRAME: string = '~12.0.1~["r","one",1,4,1]';
const ROW_ACK_FRAME: string = '~13.0.1~["a",42]';
/**
 * Protobuf written and read the same way by apps/mobile's protocol test: the bytes after each
 * frame header, in hex. AT needs more than 32 bits.
 */
const AT: number = 1764320000000;
const PROTO_PLAN_HEX: string =
  '0a2e0a026b31120450757368180a22200a0b62656e63682d7072657373120b42656e636820707265737318022008303c';
const PROTO_SESSION_HEX: string = '121b0a036f6e6510021a04507573682880f0aacdac3338014a03000008';
const PROTO_DAY_HEX: string =
  '22400a0a323032362d30332d30321202753118d00f2207086410c801183c286432060801100218033a0161' +
  '42150a130a026d3112045269636518f403200a28143005';
const PROTO_TOTALS_HEX: string =
  '22290a0a323032362d30332d30321202753118d00f2207086410c801183c286432060801100218033a0161';
const PROTO_FOOD_HEX: string = '2a180a160a056c6f672d3112026d311a0275312080f0aacdac33';
const PROTO_REPS_HEX: string = '1a0b0a036f6e65100118042001';
const PROTO_ACK_HEX: string = '3202082a';

/** A frame as sent: the header, then one character per byte. */
function binary(header: string, hex: string): string {
  let frame = header;
  for (let index = 0; index < hex.length; index += 2) {
    frame += String.fromCharCode(parseInt(hex.slice(index, index + 2), 16));
  }
  return frame;
}
/** Written by apps/mobile's protocol test from its "Push" routine. */
const COMPACT_PLAN_FRAME: string =
  '~8.0.1~{"t":"plan","plan":{"name":"Push","minutes":10,"x":[["bench-press","Bench press",2,8,0,60,""]]},"key":"k1"}';

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

    it('writes rows exactly as the phone test reads them', 0, () => {
      const session: SharedSession = {
        id: 'one',
        rev: 2,
        plan: 'Push',
        status: 'active',
        at: 1000,
        end: 0,
        pos: 1,
        rest: 0,
        log: [[0, 0, 8]],
        skip: [],
      };
      const log: FoodLog = { id: 'log-1', ref: 'm1', owner: 'u1', at: 1000 };
      const live: LiveReps = { id: 'one', pos: 1, reps: 4, auto: true };
      const session9 = encodeFrames({ t: 'session', session: session }, 180, 9, 'rows');
      expect(session9[0]).assertEqual(ROW_SESSION_FRAME);
      const food = encodeFrames({ t: 'food', logs: [log] }, 180, 11, 'rows');
      expect(food[0]).assertEqual(ROW_FOOD_FRAME);
      expect(encodeFrames({ t: 'reps', live: live }, 180, 12, 'rows')[0]).assertEqual(
        ROW_REPS_FRAME,
      );
      expect(encodeFrames({ t: 'ack', id: 42 }, 180, 13, 'rows')[0]).assertEqual(ROW_ACK_FRAME);
      // The handshake stays named, so every phone app reads it.
      const welcome = encodeFrames({ t: 'welcome', v: 1, ok: true }, 180, 7, 'rows');
      expect(welcome[0]).assertEqual(FIXTURE_FRAME);
    });

    it('reads the rows the phone writes, and rejects broken ones', 0, () => {
      const plan = new FrameAssembler().push(ROW_PLAN_FRAME);
      expect((plan?.plan as WorkoutPlan).exercises[0].name).assertEqual('Bench press');
      expect(plan?.key).assertEqual('k1');
      const session = new FrameAssembler().push(ROW_SESSION_FRAME)?.session as SharedSession;
      expect(session.status).assertEqual('active');
      expect(JSON.stringify(session.log)).assertEqual('[[0,0,8]]');
      const day = new FrameAssembler().push(ROW_DAY_FRAME)?.day as DayInfo;
      expect(day.eaten.fat).assertEqual(3);
      expect((day.favorites as FavoriteMeal[])[0].kcal).assertEqual(500);
      expect(new FrameAssembler().push(ROW_ACK_FRAME)?.id).assertEqual(42);
      const totals = '~1.0.1~["d","2026-03-02","u1",2000,[100,200,60],100,[1,2,3],[]]';
      expect(new FrameAssembler().push(totals)?.day?.favorites).assertUndefined();
      // A log that does not split into sets, an unknown status, a short macro row.
      const broken: string[] = [
        '~1.0.1~["s","one",2,"Push",0,1000,0,1,0,[0,0],[]]',
        '~1.0.1~["s","one",2,"Push",3,1000,0,1,0,[],[]]',
        '~1.0.1~["d","2026-03-02","u1",2000,[100,200],100,[1,2,3],[]]',
      ];
      broken.forEach((frame: string) => {
        expect(new FrameAssembler().push(frame)).assertUndefined();
      });
    });

    it('writes protobuf exactly as the phone test reads it', 0, () => {
      const session: SharedSession = {
        id: 'one',
        rev: 2,
        plan: 'Push',
        status: 'active',
        at: AT,
        end: 0,
        pos: 1,
        rest: 0,
        log: [[0, 0, 8]],
        skip: [],
      };
      const log: FoodLog = { id: 'log-1', ref: 'm1', owner: 'u1', at: AT };
      const live: LiveReps = { id: 'one', pos: 1, reps: 4, auto: true };
      const proto = (message: SyncMessage, id: number): string =>
        encodeFrames(message, 180, id, 'protobuf')[0];
      expect(proto({ t: 'session', session: session }, 9)).assertEqual(
        binary('#9.0.1#', PROTO_SESSION_HEX),
      );
      expect(proto({ t: 'food', logs: [log] }, 11)).assertEqual(binary('#11.0.1#', PROTO_FOOD_HEX));
      expect(proto({ t: 'reps', live: live }, 12)).assertEqual(binary('#12.0.1#', PROTO_REPS_HEX));
      expect(proto({ t: 'ack', id: 42 }, 13)).assertEqual(binary('#13.0.1#', PROTO_ACK_HEX));
      // The handshake stays named JSON, so every phone app reads it.
      expect(proto({ t: 'welcome', v: 1, ok: true }, 7)).assertEqual(FIXTURE_FRAME);
    });

    it('reads the protobuf the phone writes, and rejects broken bytes', 0, () => {
      const plan = new FrameAssembler().push(binary('#8.0.1#', PROTO_PLAN_HEX));
      expect((plan?.plan as WorkoutPlan).exercises[0].name).assertEqual('Bench press');
      expect((plan?.plan as WorkoutPlan).exercises[0].rest).assertEqual(60);
      expect(plan?.key).assertEqual('k1');
      const frame = binary('#9.0.1#', PROTO_SESSION_HEX);
      const session = new FrameAssembler().push(frame)?.session as SharedSession;
      expect(session.at).assertEqual(AT);
      expect(typeof session.at).assertEqual('number');
      expect(session.status).assertEqual('active');
      expect(JSON.stringify(session.log)).assertEqual('[[0,0,8]]');
      const day = new FrameAssembler().push(binary('#10.0.1#', PROTO_DAY_HEX))?.day as DayInfo;
      expect(day.eaten.fat).assertEqual(3);
      expect((day.favorites as FavoriteMeal[])[0].kcal).assertEqual(500);
      const totals = new FrameAssembler().push(binary('#10.0.1#', PROTO_TOTALS_HEX));
      expect(totals?.day?.favorites).assertUndefined();
      expect(new FrameAssembler().push(binary('#13.0.1#', PROTO_ACK_HEX))?.id).assertEqual(42);
      // Cut short, not protobuf, no message at all.
      expect(new FrameAssembler().push(frame.slice(0, frame.length - 1))).assertUndefined();
      expect(new FrameAssembler().push(binary('#1.0.1#', 'ffffff'))).assertUndefined();
      expect(new FrameAssembler().push('#1.0.1#')).assertUndefined();
    });

    it('splits protobuf into frames and puts it back together', 0, () => {
      const log: number[][] = [];
      for (let index = 0; index < 60; index++) {
        log.push([index % 30, index % 3, 10]);
      }
      const session: SharedSession = {
        id: 'one',
        rev: 2,
        plan: 'Push',
        status: 'done',
        at: AT,
        end: AT + 1,
        pos: 59,
        rest: 0,
        log: log,
        skip: [2],
      };
      const frames = encodeFrames({ t: 'session', session: session }, 40, 5, 'protobuf');
      expect(frames.length > 3).assertTrue();
      // The watch reads sessions from the phone, so read it back through the phone format.
      const assembler = new FrameAssembler();
      let read: SyncMessage | undefined = undefined;
      frames.forEach((part: string) => {
        read = assembler.push(part);
      });
      const back = (read as SyncMessage | undefined)?.session as SharedSession;
      expect(JSON.stringify(back)).assertEqual(JSON.stringify(session));
    });

    it('reads an ack and remembers which message to ack', 0, () => {
      const assembler = new FrameAssembler();
      expect(assembler.push('~12.0.1~{"t":"ack","id":42}')?.id).assertEqual(42);
      expect(assembler.lastId).assertEqual(12);
      expect(assembler.push('~13.0.1~{"t":"ack","id":1000}')).assertUndefined();
    });

    it('reads the compact plan the phone writes, and rejects bad rows', 0, () => {
      const message = new FrameAssembler().push(COMPACT_PLAN_FRAME);
      const expected: WorkoutPlan = {
        name: 'Push',
        minutes: 10,
        exercises: [
          {
            key: 'bench-press',
            name: 'Bench press',
            sets: 2,
            reps: 8,
            unit: 'reps',
            rest: 60,
            superset: '',
          },
        ],
      };
      expect(JSON.stringify(message?.plan)).assertEqual(JSON.stringify(expected));
      expect(message?.key).assertEqual('k1');
      const bad: string[] = [
        // No sets, an unknown unit, a short row.
        '[["a","A",0,8,0,60,""]]',
        '[["a","A",2,8,2,60,""]]',
        '[["a","A",2,8]]',
      ];
      bad.forEach((rows: string) => {
        const frame = `~1.0.1~{"t":"plan","plan":{"name":"P","minutes":1,"x":${rows}}}`;
        expect(new FrameAssembler().push(frame)).assertUndefined();
      });
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

    it('keeps its favorites when a day leaves them out, but not for another account', 0, () => {
      const day = loadedDay(noon);
      const totals = info(isoDay(noon));
      totals.favorites = undefined;
      totals.kcalEaten = 900;
      day.apply(totals);
      expect(day.kcalEaten).assertEqual(900);
      expect(day.favorites.length).assertEqual(1);
      const other = info(isoDay(noon), [], 'u2');
      other.favorites = undefined;
      day.apply(other);
      expect(day.favorites.length).assertEqual(0);
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
