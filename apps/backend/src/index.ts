import { app } from "./app"
import { withDatabaseBinding } from "./db"
import { expireDraftMealPhotos } from "./lib/meal-images"
import { consumeEmailBatch } from "./modules/email/queue"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return withDatabaseBinding(env, () => app.fetch(request))
  },
  async queue(batch: MessageBatch<unknown>, env: Env): Promise<void> {
    return withDatabaseBinding(env, () => consumeEmailBatch(batch))
  },
  async scheduled(controller: ScheduledController, env: Env): Promise<void> {
    await expireDraftMealPhotos(env.MEAL_IMAGES, controller.scheduledTime)
  },
} satisfies ExportedHandler<Env>
