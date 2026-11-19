import { app as fitwearApp } from "../../src/app"
import { withWorkerBindings, type WorkerBindings } from "../../src/worker/bindings"
import { createTestEmailQueue } from "./test-email-queue"

const fallbackEmailQueue = createTestEmailQueue().queue
let bindings: WorkerBindings = {}

export function setTestDatabaseBinding(next: WorkerBindings) {
  bindings = { ...next, EMAIL_QUEUE: next.EMAIL_QUEUE ?? fallbackEmailQueue }
}

export const app = {
  handle: (request: Request) => withWorkerBindings(bindings, () => fitwearApp.handle(request)),
}
