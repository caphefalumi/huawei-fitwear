/** Today's food totals and the favorites that can be logged from the watch. */

export const MAX_FAVORITES: number = 5;

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Food {
  name: string;
  kcal: number;
  macros: Macros;
}

export interface DayTotals {
  kcalTarget: number;
  kcalEaten: number;
  target: Macros;
  eaten: Macros;
}

@ObservedV2
export class FoodDay {
  readonly favorites: Food[];
  private readonly base: DayTotals;
  /** Entries logged on the watch, oldest first; not yet sent to the phone. */
  @Trace logged: Food[] = [];

  constructor(base: DayTotals, favorites: Food[]) {
    this.base = base;
    this.favorites = favorites.slice(0, MAX_FAVORITES);
  }

  get kcalTarget(): number {
    return this.base.kcalTarget;
  }

  get kcalEaten(): number {
    let total = this.base.kcalEaten;
    this.logged.forEach((food: Food) => {
      total += food.kcal;
    });
    return total;
  }

  get target(): Macros {
    return this.base.target;
  }

  get eaten(): Macros {
    const total: Macros = {
      protein: this.base.eaten.protein,
      carbs: this.base.eaten.carbs,
      fat: this.base.eaten.fat,
    };
    this.logged.forEach((food: Food) => {
      total.protein += food.macros.protein;
      total.carbs += food.macros.carbs;
      total.fat += food.macros.fat;
    });
    return total;
  }

  timesLogged(food: Food): number {
    return this.logged.filter((entry: Food) => entry.name === food.name).length;
  }

  log(food: Food): void {
    this.logged = this.logged.concat([food]);
  }

  undoLast(): void {
    this.logged = this.logged.slice(0, -1);
  }
}
