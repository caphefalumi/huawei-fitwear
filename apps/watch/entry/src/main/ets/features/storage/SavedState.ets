/** What the watch keeps between launches. Pure functions, so they can be unit tested. */
import { FoodDay } from '../quicklog/FoodDay';
import { SessionSnapshot, WorkoutSession, WorkoutStatus } from '../workout/WorkoutSession';

const VERSION: number = 1;

interface SavedState {
  version: number;
  day: string;
  summaryDismissed: boolean;
  /** Names of favorites logged on the watch. */
  logged: string[];
  session: SessionSnapshot;
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
    session: session.snapshot(),
  };
  return JSON.stringify(state);
}

/**
 * Applies saved state to a fresh session and day, and returns whether the summary was dismissed.
 * Food logs and finished workouts expire at midnight; a workout in progress does not.
 * Damaged or outdated data is ignored.
 */
export function restoreState(
  json: string,
  session: WorkoutSession,
  day: FoodDay,
  now: number,
): boolean {
  try {
    const state = JSON.parse(json) as SavedState;
    if (state.version !== VERSION) {
      return false;
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
    if (today || state.session.status === WorkoutStatus.ACTIVE) {
      return session.restore(state.session, now) && state.summaryDismissed;
    }
  } catch (err) {
    return false;
  }
  return false;
}
