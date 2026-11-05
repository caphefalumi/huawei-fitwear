import { compare } from "bcryptjs"

const PASSWORD_HASH_PREFIX = "pbkdf2-sha256"
const PASSWORD_HASH_ITERATIONS = 100_000
const PASSWORD_HASH_BYTES = 32
const PASSWORD_SALT_BYTES = 16
const PASSWORD_MAX_BYTES = 72

export function isPasswordWithinLimit(password: string): boolean {
  return new TextEncoder().encode(password).length <= PASSWORD_MAX_BYTES
}

function encodeBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function decodeBase64(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const binary = atob(value)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index)
    return bytes
  } catch {
    return null
  }
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    PASSWORD_HASH_BYTES * 8,
  )
  return new Uint8Array(bits)
}

export async function hashPassword(password: string): Promise<string> {
  if (!isPasswordWithinLimit(password)) {
    throw new RangeError("Password must not exceed 72 UTF-8 bytes.")
  }
  const salt = crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES))
  const hash = await derivePasswordHash(password, salt, PASSWORD_HASH_ITERATIONS)
  return `${PASSWORD_HASH_PREFIX}$${PASSWORD_HASH_ITERATIONS}$${encodeBase64(salt)}$${encodeBase64(hash)}`
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const pbkdf2 = /^pbkdf2-sha256\$(\d+)\$([A-Za-z0-9+/]+={0,2})\$([A-Za-z0-9+/]+={0,2})$/.exec(
    encoded,
  )
  if (pbkdf2) {
    const iterations = Number(pbkdf2[1])
    const salt = decodeBase64(pbkdf2[2]!)
    const expected = decodeBase64(pbkdf2[3]!)
    if (
      !isPasswordWithinLimit(password) ||
      !Number.isSafeInteger(iterations) ||
      iterations < 1 ||
      iterations > PASSWORD_HASH_ITERATIONS ||
      salt?.length !== PASSWORD_SALT_BYTES ||
      expected?.length !== PASSWORD_HASH_BYTES
    ) {
      return false
    }
    try {
      const actual = await derivePasswordHash(password, salt, iterations)
      let difference = 0
      for (let index = 0; index < actual.length; index++)
        difference |= actual[index]! ^ expected[index]!
      return difference === 0
    } catch {
      return false
    }
  }

  const bcryptRounds = /^\$2[aby]\$(\d\d)\$/.exec(encoded)?.[1]
  if (
    encoded.startsWith(`${PASSWORD_HASH_PREFIX}$`) ||
    (!isPasswordWithinLimit(password) && bcryptRounds !== "10")
  ) {
    return false
  }
  try {
    return await compare(password, encoded)
  } catch {
    return false
  }
}

export function needsPasswordRehash(encoded: string): boolean {
  const pbkdf2 = /^pbkdf2-sha256\$(\d+)\$/.exec(encoded)
  return !pbkdf2 || Number(pbkdf2[1]) !== PASSWORD_HASH_ITERATIONS
}
