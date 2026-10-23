export function generateId(): string {
  return Bun.randomUUIDv7();
}

export function generateToken(): string {
  return (Bun.randomUUIDv7() + Bun.randomUUIDv7()).replaceAll('-', '');
}
