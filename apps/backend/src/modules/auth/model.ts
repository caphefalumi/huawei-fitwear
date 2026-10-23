import { t, type Static } from 'elysia';

export const AuthModel = {
  signUpBody: t.Object({
    email: t.String({ format: 'email', error: 'Valid email is required' }),
    password: t.String({ minLength: 8, error: 'Password must be at least 8 characters' }),
    name: t.Optional(t.String()),
    gender: t.Optional(t.Union([t.Literal('male'), t.Literal('female'), t.Literal('other')])),
    birthDate: t.Optional(t.String()),
    heightCm: t.Optional(t.Number({ minimum: 0 })),
    currentWeightKg: t.Optional(t.Number({ minimum: 0 })),
    targetWeightKg: t.Optional(t.Number({ minimum: 0 })),
    activityLevel: t.Optional(
      t.Union([
        t.Literal('sedentary'),
        t.Literal('lightly_active'),
        t.Literal('moderately_active'),
        t.Literal('very_active'),
        t.Literal('extra_active'),
      ])
    ),
    fitnessGoal: t.Optional(
      t.Union([t.Literal('weight_loss'), t.Literal('maintenance'), t.Literal('muscle_gain')])
    ),
  }),

  signInBody: t.Object({
    email: t.String({ format: 'email', error: 'Valid email is required' }),
    password: t.String({ minLength: 1, error: 'Password is required' }),
  }),

  updateUserBody: t.Object({
    name: t.Optional(t.String()),
    gender: t.Optional(t.Union([t.Literal('male'), t.Literal('female'), t.Literal('other')])),
    birthDate: t.Optional(t.String()),
    heightCm: t.Optional(t.Number({ minimum: 0 })),
    currentWeightKg: t.Optional(t.Number({ minimum: 0 })),
    targetWeightKg: t.Optional(t.Number({ minimum: 0 })),
    activityLevel: t.Optional(
      t.Union([
        t.Literal('sedentary'),
        t.Literal('lightly_active'),
        t.Literal('moderately_active'),
        t.Literal('very_active'),
        t.Literal('extra_active'),
      ])
    ),
    fitnessGoal: t.Optional(
      t.Union([t.Literal('weight_loss'), t.Literal('maintenance'), t.Literal('muscle_gain')])
    ),
  }),
} as const;

export type SignUpBody = Static<typeof AuthModel.signUpBody>;
export type SignInBody = Static<typeof AuthModel.signInBody>;
export type UpdateUserBody = Static<typeof AuthModel.updateUserBody>;
