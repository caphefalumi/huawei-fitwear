const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string, { allowEmpty = false }: { allowEmpty?: boolean } = {}) {
  const trimmed = value.trim()
  if (!trimmed) {
    return allowEmpty ? null : "Enter your email address."
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Enter a valid email address."
  }
  return null
}

export function passwordByteLength(value: string) {
  return encodeURIComponent(value).replace(/%[0-9A-F]{2}/gi, "x").length
}

export function validatePassword(value: string) {
  if (Array.from(value).length < 8) {
    return "Use at least 8 characters."
  }
  if (passwordByteLength(value) > 72) {
    return "Password is too long. Use 72 characters or fewer."
  }
  return null
}

export const PASSWORD_FIELD_HELPER = "At least 8 characters."

export function validateBirthDate(iso: string) {
  if (!iso) {
    return "Enter your date of birth."
  }
  const date = new Date(`${iso}T00:00:00Z`)
  const valid =
    /^\d{4}-\d{2}-\d{2}$/.test(iso) &&
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === iso
  if (!valid) {
    return "Enter a valid date of birth."
  }
  if (iso > new Date().toISOString().slice(0, 10)) {
    return "Date of birth can't be in the future."
  }
  return null
}
