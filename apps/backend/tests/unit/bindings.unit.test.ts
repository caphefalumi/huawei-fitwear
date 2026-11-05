import { describe, expect, it } from "bun:test"

import { getKv, withDatabaseBinding } from "../../src/db"
import { createTestKv } from "../helpers/test-kv"

describe("Concurrent Worker binding scope", () => {
  it("keeps bindings isolated across interleaved requests", async () => {
    const first = createTestKv()
    const second = createTestKv()
    const { promise: barrier, resolve: release } = Promise.withResolvers<void>()
    const pending = withDatabaseBinding({ fitwear_kv: first }, async () => {
      await barrier
      expect(getKv()).toBe(first)
      await getKv()!.put("owner", "first")
    })
    await withDatabaseBinding({ fitwear_kv: second }, async () => {
      await getKv()!.put("owner", "second")
      release()
      await pending
      expect(await getKv()!.get("owner")).toBe("second")
    })
    expect(await first.get("owner")).toBe("first")
  })
})
