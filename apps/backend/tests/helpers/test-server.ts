import { createTestEmailQueue } from "./test-email-queue";
import { app } from "../../src/app";
import { withDatabaseBinding } from "../../src/db";
import { createTestDatabase } from "./test-db";
import { createTestKv } from "./test-kv";

const PORT = Number(Bun.env.PORT || 8787);
const { d1 } = createTestDatabase();

const bindings = { DB: d1, fitwear_kv: createTestKv(), EMAIL_QUEUE: createTestEmailQueue().queue };

Bun.serve({
  hostname: "127.0.0.1",
  port: PORT,
  fetch: (request) => withDatabaseBinding(bindings, () => app.handle(request)),
});
console.log(`[E2E Server] Running at http://127.0.0.1:${PORT}`);
