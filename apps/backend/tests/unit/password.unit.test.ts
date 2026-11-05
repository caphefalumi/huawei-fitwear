import { describe, expect, it } from "bun:test"

import {
  hashPassword,
  isPasswordWithinLimit,
  needsPasswordRehash,
  verifyPassword,
} from "../../src/lib/password"

describe("Password hashing and legacy compatibility", () => {
  it("hashes passwords using PBKDF2-HMAC-SHA256 at 100,000 iterations", async () => {
    const password = "SuperSecretPassword123!"
    const encoded = await hashPassword(password)
    expect(encoded).toStartWith("pbkdf2-sha256$100000$")
    expect(encoded.split("$")).toHaveLength(4)
    expect(needsPasswordRehash(encoded)).toBeFalse()
  })

  it("should verify correct password successfully", async () => {
    const password = "MyFitnessPassword2026!"
    const hash = await hashPassword(password)
    const isValid = await verifyPassword(password, hash)

    expect(isValid).toBeTrue()
  })

  it("should reject incorrect password", async () => {
    const password = "CorrectPassword!"
    const hash = await hashPassword(password)
    const isValid = await verifyPassword("WrongPassword123!", hash)

    expect(isValid).toBeFalse()
  })

  it("should generate distinct hashes for identical passwords (proper salt generation)", async () => {
    const password = "CommonPassword123!"
    const hash1 = await hashPassword(password)
    const hash2 = await hashPassword(password)

    expect(hash1).not.toBe(hash2)
    expect(await verifyPassword(password, hash1)).toBeTrue()
    expect(await verifyPassword(password, hash2)).toBeTrue()
  })

  it("rejects passwords over 72 UTF-8 bytes", async () => {
    expect(isPasswordWithinLimit("é".repeat(37))).toBeFalse()
    await expect(hashPassword("é".repeat(37))).rejects.toThrow("72 UTF-8 bytes")
  })

  it("continues to verify existing Bun bcrypt hashes", async () => {
    const password = "ExistingMember123!"
    const legacyHash = await Bun.password.hash(password, { algorithm: "bcrypt", cost: 10 })
    expect(await verifyPassword(password, legacyHash)).toBe(true)
    expect(await verifyPassword("wrong-password", legacyHash)).toBe(false)
    expect(needsPasswordRehash(legacyHash)).toBeTrue()
  })
})
