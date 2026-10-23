import { describe, expect, it } from 'bun:test';
import { Value } from '@sinclair/typebox/value';
import { AuthModel } from '../../src/modules/auth/model';

describe('Unit Test: Auth Validation Schemas', () => {
  describe('signUpBody', () => {
    it('should validate valid sign-up payload', () => {
      const validPayload = {
        email: 'alex@fitwear.dev',
        password: 'StrongPassword123',
        name: 'Alex Morgan',
        gender: 'female',
        birthDate: '1995-04-12',
        heightCm: 172,
        currentWeightKg: 64.5,
        targetWeightKg: 62.0,
        activityLevel: 'very_active',
        fitnessGoal: 'maintenance',
      };

      expect(Value.Check(AuthModel.signUpBody, validPayload)).toBeTrue();
    });

    it('should reject invalid email format', () => {
      const invalidPayload = {
        email: 'not-an-email',
        password: 'StrongPassword123',
      };

      expect(Value.Check(AuthModel.signUpBody, invalidPayload)).toBeFalse();
    });

    it('should reject passwords shorter than 8 characters', () => {
      const shortPasswordPayload = {
        email: 'user@fitwear.dev',
        password: 'short',
      };

      expect(Value.Check(AuthModel.signUpBody, shortPasswordPayload)).toBeFalse();
    });

    it('should reject invalid gender or enum values', () => {
      const invalidEnumPayload = {
        email: 'user@fitwear.dev',
        password: 'StrongPassword123',
        gender: 'alien',
      };

      expect(Value.Check(AuthModel.signUpBody, invalidEnumPayload)).toBeFalse();
    });
  });

  describe('signInBody', () => {
    it('should accept valid credentials', () => {
      const validPayload = {
        email: 'member@fitwear.dev',
        password: 'password123',
      };

      expect(Value.Check(AuthModel.signInBody, validPayload)).toBeTrue();
    });

    it('should reject empty password', () => {
      const emptyPasswordPayload = {
        email: 'member@fitwear.dev',
        password: '',
      };

      expect(Value.Check(AuthModel.signInBody, emptyPasswordPayload)).toBeFalse();
    });
  });

  describe('updateUserBody', () => {
    it('should accept partial profile updates', () => {
      const partialUpdate = {
        currentWeightKg: 73.2,
        fitnessGoal: 'muscle_gain',
      };

      expect(Value.Check(AuthModel.updateUserBody, partialUpdate)).toBeTrue();
    });
  });
});
