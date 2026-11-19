import { app } from "./app"
import { consumeEmailBatch } from "./modules/email/queue"
import { expireDraftMealPhotos } from "./modules/meals/photo-storage"
import { withWorkerBindings } from "./worker/bindings"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return withWorkerBindings(env, () => app.fetch(request))
  },
  async queue(batch: MessageBatch<unknown>, env: Env): Promise<void> {
    return withWorkerBindings(env, () => consumeEmailBatch(batch))
  },
  async scheduled(controller: ScheduledController, env: Env): Promise<void> {
    await expireDraftMealPhotos(env.MEAL_IMAGES, controller.scheduledTime)
  },
} satisfies ExportedHandler<Env>
