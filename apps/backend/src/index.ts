import { consumeEmailBatch } from "./modules/email/queue"
import { withDatabaseBinding } from "./db"
import { app } from "./app"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return withDatabaseBinding(env, () => app.fetch(request))
  },
  async queue(batch: MessageBatch<unknown>, env: Env): Promise<void> {
    return withDatabaseBinding(env, () => consumeEmailBatch(batch))
  },
} satisfies ExportedHandler<Env>
