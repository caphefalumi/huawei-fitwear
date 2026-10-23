export function generateId(): string {
  if (typeof Bun !== 'undefined' && Bun.randomUUIDv7) {
    return Bun.randomUUIDv7();
  }
  return crypto.randomUUID();
}

export function generateToken(): string {
  if (typeof Bun !== 'undefined' && Bun.randomUUIDv7) {
    return (Bun.randomUUIDv7() + Bun.randomUUIDv7()).replaceAll('-', '');
  }
  return (crypto.randomUUID() + crypto.randomUUID()).replaceAll('-', '');
}
