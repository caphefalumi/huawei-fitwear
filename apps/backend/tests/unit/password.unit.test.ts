import { describe, expect, it } from 'bun:test';
import { hashPassword, verifyPassword } from '../../src/lib/password';

describe('Password hashing and legacy compatibility', () => {
  it('should hash password and produce standard bcrypt format', async () => {
    const password = 'SuperSecretPassword123!';
    const hash = await hashPassword(password);

    expect(hash).toBeString();
    expect(hash.startsWith('$2')).toBeTrue();
    expect(hash.length).toBeGreaterThan(40);
  });

  it('should verify correct password successfully', async () => {
    const password = 'MyFitnessPassword2026!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBeTrue();
  });

  it('should reject incorrect password', async () => {
    const password = 'CorrectPassword!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('WrongPassword123!', hash);

    expect(isValid).toBeFalse();
  });

  it('should generate distinct hashes for identical passwords (proper salt generation)', async () => {
    const password = 'CommonPassword123!';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
    expect(await verifyPassword(password, hash1)).toBeTrue();
    expect(await verifyPassword(password, hash2)).toBeTrue();
  });

  it('accepts an existing Bun bcrypt hash without changing stored credentials', async () => {
    const password = 'ExistingMember123!';
    const legacyHash = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 });
    expect(await verifyPassword(password, legacyHash)).toBe(true);
    expect(await verifyPassword('wrong-password', legacyHash)).toBe(false);
  });
});
