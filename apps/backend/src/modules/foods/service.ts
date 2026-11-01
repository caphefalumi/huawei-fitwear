import type { FoodSearchQuery } from './index';
import { asc, eq, like } from 'drizzle-orm';
import { status } from 'elysia';
import { getDb, foods as foodsTable } from '../../db';
import { scalePer100 } from '../../lib/nutrition';

const DEFAULT_LIMIT = 25;

export abstract class Foods {
  static async search(query: FoodSearchQuery, d1?: D1Database) {
    const db = getDb(d1);
    const term = query.q?.trim();

    const rows = term
      ? await db
          .select()
          .from(foodsTable)
          .where(like(foodsTable.name, `%${term}%`))
          .orderBy(asc(foodsTable.name))
          .limit(query.limit ?? DEFAULT_LIMIT)
          .all()
      : await db
          .select()
          .from(foodsTable)
          .orderBy(asc(foodsTable.name))
          .limit(query.limit ?? DEFAULT_LIMIT)
          .all();

    return { foods: rows, count: rows.length };
  }

  static async byId(foodId: string, d1?: D1Database) {
    const db = getDb(d1);
    const food = await db.select().from(foodsTable).where(eq(foodsTable.id, foodId)).get();
    if (!food) {
      throw status(404, { success: false, message: 'Food not found' });
    }
    return food;
  }

  static async estimatePortion(foodId: string, weightG: number, d1?: D1Database) {
    const food = await Foods.byId(foodId, d1);
    return {
      food,
      weightG,
      nutrition: scalePer100(food, weightG),
    };
  }
}
