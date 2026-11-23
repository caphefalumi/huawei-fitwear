import { appSchema, tableSchema } from "@nozbe/watermelondb"

export const sessionDraftSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "session_drafts",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        // The whole SessionDraft, JSON-encoded. One small row per user.
        { name: "payload", type: "string" },
      ],
    }),
  ],
})
