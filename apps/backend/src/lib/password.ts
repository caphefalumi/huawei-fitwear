import { compare, hash } from "bcryptjs"

const BCRYPT_ROUNDS = 12
const BCRYPT_MAX_BYTES = 72

export function isPasswordWithinBcryptLimit(password: string): boolean {
  return new TextEncoder().encode(password).length <= BCRYPT_MAX_BYTES
}

export async function hashPassword(password: string): Promise<string> {
  if (!isPasswordWithinBcryptLimit(password)) {
    throw new RangeError("Password must not exceed 72 UTF-8 bytes when using bcrypt.")
  }
  return hash(password, BCRYPT_ROUNDS)
}
export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const rounds = /^\$2[aby]\$(\d\d)\$/.exec(encoded)?.[1]
  if (!isPasswordWithinBcryptLimit(password) && rounds !== "10") return false
  try {
    return await compare(password, encoded)
  } catch {
    return false
  }
}

export function needsPasswordRehash(encoded: string): boolean {
  const rounds = /^\$2[aby]\$(\d\d)\$/.exec(encoded)?.[1]
  return rounds !== String(BCRYPT_ROUNDS)
}
