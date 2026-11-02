import { createTestEmailQueue } from "./test-email-queue";
import { app as fitwearApp } from "../../src/app";
import { withDatabaseBinding, type WorkerBindings } from "../../src/db";

const fallbackEmailQueue = createTestEmailQueue().queue;
let bindings: WorkerBindings = {};

export function setTestDatabaseBinding(next: WorkerBindings) {
  bindings = { ...next, EMAIL_QUEUE: next.EMAIL_QUEUE ?? fallbackEmailQueue };
}

export const app = {
  handle: (request: Request) => withDatabaseBinding(bindings, () => fitwearApp.handle(request)),
};
