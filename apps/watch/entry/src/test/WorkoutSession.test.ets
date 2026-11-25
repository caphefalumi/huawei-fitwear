import { describe, expect, it } from '@ohos/hypium';
import { FoodDay } from '../main/ets/features/quicklog/FoodDay';
import { encodeState, restoreState } from '../main/ets/features/storage/SavedState';
import {
  IDLE_ANSWER_MS,
  IDLE_PROMPT_MS,
  TickEvent,
  WorkoutPhase,
  WorkoutPlan,
  WorkoutSession,
  WorkoutStatus,
} from '../main/ets/features/workout/WorkoutSession';

const PLAN: WorkoutPlan = {
  group: 'Chest',
  minutes: 10,
  exercises: [
    { name: 'A', sets: 2, reps: 3, restSeconds: 60 },
    { name: 'B', sets: 1, reps: 3, restSeconds: 60 },
  ],
};

function emptyDay(): FoodDay {
  return new FoodDay(
    {
      kcalTarget: 2000,
      kcalEaten: 100,
      target: { protein: 100, carbs: 200, fat: 60 },
      eaten: { protein: 1, carbs: 2, fat: 3 },
    },
    [{ name: 'Rice', kcal: 500, macros: { protein: 10, carbs: 20, fat: 5 } }],
  );
}

function started(): WorkoutSession {
  const session = new WorkoutSession(PLAN);
  session.start(1000);
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
      expect(session.activeMs).assertEqual(120000);
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

    it('keeps finished sets across new cycle, skip and early end', 0, () => {
      const session = started();
      session.doneSet(2000);
      session.newCycle(3000);
      expect(session.cycle).assertEqual(2);
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

  describe('FoodDay', () => {
    it('adds a logged favorite to totals and undoes it', 0, () => {
      const day = new FoodDay(
        {
          kcalTarget: 2000,
          kcalEaten: 100,
          target: { protein: 100, carbs: 200, fat: 60 },
          eaten: { protein: 1, carbs: 2, fat: 3 },
        },
        [{ name: 'Rice', kcal: 500, macros: { protein: 10, carbs: 20, fat: 5 } }],
      );
      day.log(day.favorites[0]);
      expect(day.kcalEaten).assertEqual(600);
      expect(day.eaten.carbs).assertEqual(22);
      expect(day.timesLogged(day.favorites[0])).assertEqual(1);
      day.undoLast();
      expect(day.kcalEaten).assertEqual(100);
    });
  });

  describe('SavedState', () => {
    const noon = new Date(2026, 0, 10, 12, 0, 0).getTime();
    const nextDay = noon + 24 * 60 * 60 * 1000;

    it('restores a workout in progress and today food logs', 0, () => {
      const session = new WorkoutSession(PLAN);
      const day = emptyDay();
      session.start(noon);
      session.doneSet(noon + 1000);
      day.log(day.favorites[0]);
      const saved = encodeState(session, day, false, noon + 1000);

      const restored = new WorkoutSession(PLAN);
      const restoredDay = emptyDay();
      restoreState(saved, restored, restoredDay, noon + 11000);
      expect(restored.status).assertEqual(WorkoutStatus.ACTIVE);
      expect(restored.records.length).assertEqual(1);
      expect(restored.restLeftMs).assertEqual(50000);
      expect(restoredDay.kcalEaten).assertEqual(600);
    });

    it('ends an abandoned workout and drops yesterday food logs', 0, () => {
      const session = new WorkoutSession(PLAN);
      const day = emptyDay();
      session.start(noon);
      session.changeReps(1, noon + 5000);
      day.log(day.favorites[0]);
      const saved = encodeState(session, day, false, noon + 5000);

      const restored = new WorkoutSession(PLAN);
      const restoredDay = emptyDay();
      restoreState(saved, restored, restoredDay, nextDay);
      expect(restored.status).assertEqual(WorkoutStatus.ENDED_EARLY);
      expect(restored.activeMs).assertEqual(5000);
      expect(restoredDay.kcalEaten).assertEqual(100);
    });

    it('ignores damaged data and a changed plan', 0, () => {
      const session = new WorkoutSession(PLAN);
      restoreState('{oops', session, emptyDay(), noon);
      expect(session.status).assertEqual(WorkoutStatus.IDLE);

      const old = new WorkoutSession(PLAN);
      old.start(noon);
      const changed: WorkoutPlan = { group: 'Legs', minutes: 5, exercises: [PLAN.exercises[1]] };
      const other = new WorkoutSession(changed);
      restoreState(encodeState(old, emptyDay(), false, noon), other, emptyDay(), noon);
      expect(other.status).assertEqual(WorkoutStatus.IDLE);
    });
  });
}
