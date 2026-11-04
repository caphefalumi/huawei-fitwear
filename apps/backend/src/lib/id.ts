export function generateId(): string {
  return crypto.randomUUID()
}

export function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")
}
