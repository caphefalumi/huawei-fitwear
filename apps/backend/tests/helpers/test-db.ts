import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../src/db/schema';

export function createTestDatabase(): { d1: D1Database; db: ReturnType<typeof drizzle> } {
  const sqlite = new Database(':memory:');

  const d1 = {
    prepare(query: string) {
      let boundParams: any[] = [];
      const stmt = {
        bind(...params: any[]) {
          boundParams = params.map((p) => {
            if (p instanceof Date) {
              return Math.floor(p.getTime() / 1000);
            }
            if (typeof p === 'boolean') {
              return p ? 1 : 0;
            }
            return p;
          });
          return stmt;
        },
        async first(colName?: string) {
          const res = sqlite.prepare(query).get(...boundParams);
          if (colName && res) return (res as any)[colName];
          return res;
        },
        async all() {
          const results = sqlite.prepare(query).all(...boundParams);
          return { results, success: true, meta: {} };
        },
        async run() {
          const res = sqlite.prepare(query).run(...boundParams);
          return {
            success: true,
            meta: { changes: res.changes, last_row_id: res.lastInsertRowid },
          };
        },
        async raw(options?: any) {
          return sqlite.prepare(query).values(...boundParams);
        },
      };
      return stmt as any;
    },
    async exec(query: string) {
      sqlite.exec(query);
      return { count: 1, duration: 0 };
    },
    async batch(stmts: any[]) {
      sqlite.exec('BEGIN TRANSACTION;');
      try {
        const results = await Promise.all(stmts.map((s) => s.run()));
        sqlite.exec('COMMIT;');
        return results;
      } catch (err) {
        sqlite.exec('ROLLBACK;');
        throw err;
      }
    },
    async dump() {
      return new ArrayBuffer(0);
    },
  } as unknown as D1Database;

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      emailVerified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      gender TEXT,
      birthDate TEXT,
      heightCm REAL,
      currentWeightKg REAL,
      targetWeightKg REAL,
      activityLevel TEXT DEFAULT 'moderately_active',
      fitnessGoal TEXT DEFAULT 'muscle_gain',
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      token TEXT UNIQUE NOT NULL,
      expiresAt INTEGER NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      ipAddress TEXT,
      userAgent TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS daily_targets (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      targetDate TEXT NOT NULL,
      calorieTargetKcal INTEGER NOT NULL,
      proteinTargetG REAL NOT NULL,
      carbsTargetG REAL NOT NULL,
      fatTargetG REAL NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      UNIQUE(userId, targetDate)
    );

    CREATE TABLE IF NOT EXISTS meal_logs (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      targetDate TEXT NOT NULL,
      mealType TEXT NOT NULL,
      imageUrl TEXT,
      scaleReferenceType TEXT DEFAULT 'finger',
      aiConfidenceOverall REAL,
      loggedAt INTEGER NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meal_items (
      id TEXT PRIMARY KEY,
      mealLogId TEXT NOT NULL REFERENCES meal_logs(id) ON DELETE CASCADE,
      foodName TEXT NOT NULL,
      estimatedWeightG REAL NOT NULL,
      correctedWeightG REAL,
      caloriesKcal REAL NOT NULL,
      proteinG REAL NOT NULL,
      carbsG REAL NOT NULL,
      fatG REAL NOT NULL,
      aiConfidence REAL,
      boundingBoxJson TEXT,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      muscleGroup TEXT NOT NULL,
      equipment TEXT NOT NULL DEFAULT 'barbell',
      cadenceAnimationUrl TEXT
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      sessionTitle TEXT NOT NULL,
      workoutSplit TEXT NOT NULL,
      avgHeartRateBpm INTEGER,
      maxHeartRateBpm INTEGER,
      startedAt INTEGER NOT NULL,
      completedAt INTEGER,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workout_sets (
      id TEXT PRIMARY KEY,
      workoutSessionId TEXT NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
      exerciseId TEXT NOT NULL REFERENCES exercises(id),
      setIndex INTEGER NOT NULL,
      weightKg REAL NOT NULL,
      targetReps INTEGER NOT NULL DEFAULT 10,
      detectedReps INTEGER,
      userConfirmedReps INTEGER NOT NULL,
      restDurationSeconds INTEGER,
      avgHrBpm INTEGER,
      createdAt INTEGER NOT NULL,
      UNIQUE(workoutSessionId, setIndex)
    );
  `);

  const db = drizzle(d1, { schema });
  return { d1, db };
}
