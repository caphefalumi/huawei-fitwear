/** What the watch keeps between launches. Pure functions, so they can be unit tested. */
import { isPlan, WorkoutPlan } from '../link/SyncProtocol';
import { FoodDay } from '../quicklog/FoodDay';
import { SessionSnapshot, WorkoutSession, WorkoutStatus } from '../workout/WorkoutSession';

const VERSION: number = 2;

interface SavedState {
  version: number;
  day: string;
  summaryDismissed: boolean;
  /** Names of favorites logged on the watch. */
  logged: string[];
  /** The plan last sent by the phone. */
  plan: WorkoutPlan;
  session: SessionSnapshot;
}

export interface Restored {
  session: WorkoutSession;
  summaryDismissed: boolean;
}

export function dayKey(now: number): string {
  const date = new Date(now);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function encodeState(
  session: WorkoutSession,
  day: FoodDay,
  summaryDismissed: boolean,
  now: number,
): string {
  const state: SavedState = {
    version: VERSION,
    day: dayKey(now),
    summaryDismissed: summaryDismissed,
    logged: day.logged.map((food) => food.name),
    plan: session.plan,
    session: session.snapshot(),
  };
  return JSON.stringify(state);
}

/**
 * Rebuilds the saved plan and session, and re-applies today's food logs to `day`.
 * Food logs and finished workouts expire at midnight; the plan and a workout in
 * progress do not. Damaged or outdated data yields a fresh session of `fallback`.
 */
export function restoreState(
  json: string,
  fallback: WorkoutPlan,
  day: FoodDay,
  now: number,
): Restored {
  const fresh: Restored = { session: new WorkoutSession(fallback), summaryDismissed: false };
  try {
    const state = JSON.parse(json) as SavedState;
    if (state.version !== VERSION || !isPlan(state.plan)) {
      return fresh;
    }
    const today = state.day === dayKey(now);
    if (today) {
      state.logged.forEach((name: string) => {
        const food = day.favorites.find((favorite) => favorite.name === name);
        if (food) {
          day.log(food);
        }
      });
    }
    const session = new WorkoutSession(state.plan);
    const wanted = today || state.session.status === WorkoutStatus.ACTIVE;
    const kept = wanted && session.restore(state.session, now);
    const restored: Restored = {
      session: session,
      summaryDismissed: kept && state.summaryDismissed,
    };
    return restored;
  } catch (err) {
    return fresh;
  }
}
