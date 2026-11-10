import * as Sentry from "@sentry/react-native"
import { useEffect, useRef, useState } from "react"
import { AppState } from "react-native"

import { userFacingPasswordResetError } from "@/lib/api/client"
import { validateEmail, validatePassword } from "@/lib/forms/form-validation"

import { useAuth } from "./auth-hooks"

type PasswordResetOptions = {
  email: string
  onStart: () => void
  onCompleted: () => void
}

export type PasswordResetStep = "email" | "code" | "password" | "done"

export function usePasswordReset({ email, onStart, onCompleted }: PasswordResetOptions) {
  const { requestPasswordReset, verifyPasswordReset, completePasswordReset } = useAuth()
  const [active, setActive] = useState(false)
  const [step, setStep] = useState<PasswordResetStep>("email")
  const [code, setCode] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resendDeadline, setResendDeadline] = useState<number | null>(null)
  const [resendSeconds, setResendSeconds] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (resendDeadline === null) return
    const updateRemaining = () =>
      setResendSeconds(Math.max(0, Math.ceil((resendDeadline - Date.now()) / 1000)))
    updateRemaining()
    const timer = setInterval(updateRemaining, 1000)
    const foregroundListener = AppState.addEventListener("change", updateRemaining)
    return () => {
      clearInterval(timer)
      foregroundListener.remove()
    }
  }, [resendDeadline])

  const resendLabel =
    resendSeconds === 0
      ? null
      : `Resend in ${String(Math.floor(resendSeconds / 60)).padStart(2, "0")}:${String(resendSeconds % 60).padStart(2, "0")}`

  function start() {
    setActive(true)
    setStep("email")
    setCode("")
    setToken(null)
    setNewPassword("")
    setError(null)
    setMessage(null)
    onStart()
  }

  function exit() {
    setActive(false)
    setStep("email")
    setCode("")
    setToken(null)
    setNewPassword("")
    setMessage(null)
  }

  function changeEmail() {
    setStep("email")
    setToken(null)
    setCode("")
    setError(null)
    setResendDeadline(null)
    setResendSeconds(0)
  }

  async function verify(nextCode: string) {
    if (pending) return
    if (!/^\d{4}$/.test(nextCode)) {
      setError("Enter the 4-digit code from your email.")
      return
    }
    setPending(true)
    setError(null)
    try {
      const nextToken = await verifyPasswordReset(email, nextCode)
      if (!mounted.current) return
      setToken(nextToken)
      setStep("password")
    } catch (cause) {
      Sentry.captureException(cause)
      if (!mounted.current) return
      setCode("")
      setError(userFacingPasswordResetError(cause, "verify"))
    } finally {
      if (mounted.current) setPending(false)
    }
  }

  async function resend() {
    if (pending || resendSeconds > 0) return
    setPending(true)
    setError(null)
    try {
      const result = await requestPasswordReset(email)
      if (!mounted.current) return
      setMessage(result.message)
      setResendDeadline(Date.now() + result.resendAfterSeconds * 1000)
      setCode("")
    } catch (cause) {
      Sentry.captureException(cause)
      if (!mounted.current) return
      setError(userFacingPasswordResetError(cause, "request"))
    } finally {
      if (mounted.current) setPending(false)
    }
  }

  async function submit() {
    if (pending) return
    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }
    if (step === "email") {
      setPending(true)
      setError(null)
      setMessage(null)
      try {
        const result = await requestPasswordReset(email)
        if (!mounted.current) return
        setMessage(result.message)
        setResendDeadline(Date.now() + result.resendAfterSeconds * 1000)
        setStep("code")
      } catch (cause) {
        Sentry.captureException(cause)
        if (!mounted.current) return
        setError(userFacingPasswordResetError(cause, "request"))
      } finally {
        if (mounted.current) setPending(false)
      }
      return
    }
    if (step === "code") {
      void verify(code)
      return
    }
    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      return
    }
    if (!token) {
      setError("Verify your reset code before choosing a new password.")
      return
    }
    setPending(true)
    setError(null)
    try {
      const nextMessage = await completePasswordReset(token, newPassword)
      if (!mounted.current) return
      setMessage(nextMessage)
      onCompleted()
      setStep("done")
    } catch (cause) {
      Sentry.captureException(cause)
      if (!mounted.current) return
      setError(userFacingPasswordResetError(cause, "complete"))
    } finally {
      if (mounted.current) setPending(false)
    }
  }

  return {
    active,
    step,
    code,
    setCode,
    newPassword,
    setNewPassword,
    pending,
    message,
    error,
    resendLabel,
    resendSeconds,
    start,
    exit,
    changeEmail,
    verify,
    resend,
    submit,
  }
}

export type PasswordResetState = ReturnType<typeof usePasswordReset>
