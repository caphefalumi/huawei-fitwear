export type AuthUser = {
  id: string
  email: string
  name: string | null
  emailVerified: boolean
  image?: string | null
  gender: "male" | "female" | "other" | null
  birthDate: string | null
  heightCm: number | null
  currentWeightKg: number | null
  targetWeightKg: number | null
  activityLevel:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active"
    | null
  fitnessGoal: "weight_loss" | "maintenance" | "muscle_gain" | null
  weeklySessions: number
  createdAt: string
  updatedAt: string
}

export type UpdateUserBody = Partial<
  Pick<
    AuthUser,
    | "name"
    | "gender"
    | "birthDate"
    | "heightCm"
    | "currentWeightKg"
    | "targetWeightKg"
    | "activityLevel"
    | "fitnessGoal"
    | "weeklySessions"
  >
>

export type SignInBody = { email: string; password: string }
export type SignUpBody = { name: string; email: string; password: string; birthDate: string }

export type AuthenticationSession = {
  token: string
  expiresAt: string
  userId: string
  id: string
}

export type AuthenticationSessionResponse = {
  user: AuthUser
  session: AuthenticationSession
}
