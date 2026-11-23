import { Database } from "@nozbe/watermelondb"
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs"

import { SessionDraftModel } from "./session-draft.model"
import { sessionDraftSchema } from "./session-draft.schema"

// IndexedDB when available; WatermelonDB falls back to in-memory otherwise.
export const database = new Database({
  adapter: new LokiJSAdapter({
    schema: sessionDraftSchema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  }),
  modelClasses: [SessionDraftModel],
})
