import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite"

let connection: Promise<SQLiteDatabase> | undefined
let pending = Promise.resolve()

async function open() {
  const db = await openDatabaseAsync("workout-drafts.db")
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS session_drafts (
        user_id TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL
      );
    `)
    return db
  } catch (error) {
    await db.closeAsync()
    throw error
  }
}

function run<T>(operation: (db: SQLiteDatabase) => Promise<T>): Promise<T> {
  // Preserve call order across autosave, discard, and a rapid return to the screen.
  const result = pending.then(async () => {
    connection ??= open().catch((error) => {
      connection = undefined
      throw error
    })
    return operation(await connection)
  })
  pending = result.then(
    () => undefined,
    () => undefined,
  )
  return result
}

export function readDraftPayload(userId: string) {
  return run(async (db) => {
    const row = await db.getFirstAsync<{ payload: string }>(
      "SELECT payload FROM session_drafts WHERE user_id = ?",
      userId,
    )
    return row?.payload ?? null
  })
}

export async function writeDraftPayload(userId: string, payload: string) {
  await run((db) =>
    db.runAsync(
      `INSERT INTO session_drafts (user_id, payload) VALUES (?, ?)
       ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload`,
      userId,
      payload,
    ),
  )
}

export async function clearDraftPayload(userId: string) {
  await run((db) => db.runAsync("DELETE FROM session_drafts WHERE user_id = ?", userId))
}
