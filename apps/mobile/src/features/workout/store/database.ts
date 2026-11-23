import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"

import { SessionDraftModel } from "./session-draft.model"
import { sessionDraftSchema } from "./session-draft.schema"

export const database = new Database({
  adapter: new SQLiteAdapter({ schema: sessionDraftSchema, dbName: "voochealth" }),
  modelClasses: [SessionDraftModel],
})
