import { app } from '../../src/index';
import { setDatabaseBinding } from '../../src/db';
import { createTestDatabase } from './test-db';

const PORT = Number(Bun.env.PORT || 8787);

const { d1 } = createTestDatabase();
setDatabaseBinding({ DB: d1 });

app.listen(PORT, () => {
  console.log(`[E2E Server] Running at http://127.0.0.1:${PORT}`);
});
