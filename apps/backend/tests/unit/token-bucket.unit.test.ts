import { describe, expect, it } from 'bun:test';
import { consumeTokenBucket } from '../../src/lib/token-bucket';
import { createTestKv } from '../helpers/test-kv';

describe('token-bucket', () => {
  it('allows up to capacity then rejects', async () => {
    const kv = createTestKv();
    const options = { capacity: 3, refillPerSecond: 0 };

    expect((await consumeTokenBucket(kv, 'test', options)).allowed).toBe(true);
    expect((await consumeTokenBucket(kv, 'test', options)).allowed).toBe(true);
    expect((await consumeTokenBucket(kv, 'test', options)).allowed).toBe(true);
    expect((await consumeTokenBucket(kv, 'test', options)).allowed).toBe(false);
  });
});
