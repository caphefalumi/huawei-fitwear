/** Today's food: the totals the phone sent, plus quick logs it has not saved yet. */
import { DayInfo, FavoriteMeal, FoodLog, Macros, MAX_FOOD_LOGS } from '../link/SyncProtocol';

/** A quick log is held this long, so that it can still be undone. */
export const UNDO_WINDOW_MS: number = 5000;

export interface PendingLog {
  id: string;
  ref: string;
  owner: string;
  /** When it was logged, ms since the epoch. */
  at: number;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

/** Local date as YYYY-MM-DD, matching the phone. */
export function isoDay(now: number): string {
  const date = new Date(now);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
}

@ObservedV2
export class FoodDay {
  /** The phone's latest figures; undefined until it has sent any. */
  @Trace info: DayInfo | undefined = undefined;
  /** Logged on the watch and not yet in the phone's figures, oldest first. */
  @Trace pending: PendingLog[] = [];
  @Trace today: string;

  constructor(now: number = Date.now()) {
    this.today = isoDay(now);
  }

  /** Takes the phone's figures, dropping quick logs that they now include. */
  apply(info: DayInfo): void {
    // Left out means unchanged, but never carried over to another account.
    const kept: FavoriteMeal[] =
      this.info !== undefined && this.info.owner === info.owner ? (this.info.favorites ?? []) : [];
    const next: DayInfo = {
      date: info.date,
      owner: info.owner,
      kcalTarget: info.kcalTarget,
      target: info.target,
      kcalEaten: info.kcalEaten,
      eaten: info.eaten,
      favorites: info.favorites ?? kept,
      applied: info.applied,
    };
    this.info = next;
    this.pending = this.pending.filter(
      (log: PendingLog) => info.applied.indexOf(log.id) < 0 && log.owner === info.owner,
    );
  }

  get hasData(): boolean {
    return this.info !== undefined;
  }

  /** 0 when the phone has no target to give. */
  get kcalTarget(): number {
    return this.info?.kcalTarget ?? 0;
  }

  get target(): Macros {
    const none: Macros = { protein: 0, carbs: 0, fat: 0 };
    return this.info?.target ?? none;
  }

  get kcalEaten(): number {
    let total = this.current ? (this.info as DayInfo).kcalEaten : 0;
    this.pendingToday.forEach((log: PendingLog) => {
      total += log.kcal;
    });
    return total;
  }

  get eaten(): Macros {
    const base = this.current ? (this.info as DayInfo).eaten : undefined;
    const total: Macros = {
      protein: base?.protein ?? 0,
      carbs: base?.carbs ?? 0,
      fat: base?.fat ?? 0,
    };
    this.pendingToday.forEach((log: PendingLog) => {
      total.protein += log.protein;
      total.carbs += log.carbs;
      total.fat += log.fat;
    });
    return total;
  }

  get favorites(): FavoriteMeal[] {
    return this.info?.favorites ?? [];
  }

  /** The phone's figures are for today; yesterday's totals no longer count. */
  private get current(): boolean {
    return this.info?.date === this.today;
  }

  private get pendingToday(): PendingLog[] {
    return this.pending.filter((log: PendingLog) => isoDay(log.at) === this.today);
  }

  waiting(food: FavoriteMeal): number {
    return this.pending.filter((log: PendingLog) => log.ref === food.ref).length;
  }

  /** False when too many logs are already waiting for the phone. */
  log(food: FavoriteMeal, id: string, now: number): boolean {
    if (!this.info || this.pending.length >= MAX_FOOD_LOGS) {
      return false;
    }
    const entry: PendingLog = {
      id: id,
      ref: food.ref,
      owner: this.info.owner,
      at: now,
      name: food.name,
      kcal: food.kcal,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
    };
    this.pending = this.pending.concat([entry]);
    return true;
  }

  undoLast(): void {
    this.pending = this.pending.slice(0, -1);
  }

  /** Logs ready to send: those that can no longer be undone. */
  due(now: number): FoodLog[] {
    return this.pending
      .filter((log: PendingLog) => now - log.at >= UNDO_WINDOW_MS)
      .map((log: PendingLog) => {
        const wire: FoodLog = { id: log.id, ref: log.ref, owner: log.owner, at: log.at };
        return wire;
      });
  }
}
