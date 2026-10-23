import { app } from './test-app';
import { setDatabaseBinding } from '../../src/db';
import { createTestDatabase } from './test-db';
import { createTestKv } from './test-kv';

const PORT = Number(Bun.env.PORT || 8787);

const { d1 } = createTestDatabase();
setDatabaseBinding({ DB: d1, fitwear_kv: createTestKv() });

app.listen(PORT, () => {
  console.log(`[E2E Server] Running at http://127.0.0.1:${PORT}`);
});
