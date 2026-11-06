import { Observe } from "expo-observe"
import { useEffect, useRef, useState } from "react"
import { AppState } from "react-native"

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
      Observe.reportError(cause)
      if (!mounted.current) return
      setCode("")
      setError(cause instanceof Error ? cause.message : "This reset code is invalid or expired.")
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
      Observe.reportError(cause)
      if (!mounted.current) return
      setError(cause instanceof Error ? cause.message : "Could not resend the reset code.")
    } finally {
      if (mounted.current) setPending(false)
    }
  }

  async function submit() {
    if (pending) return
    if (!email.trim()) {
      setError("Enter your email address.")
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
        Observe.reportError(cause)
        if (!mounted.current) return
        setError(cause instanceof Error ? cause.message : "Could not request a password reset.")
      } finally {
        if (mounted.current) setPending(false)
      }
      return
    }
    if (step === "code") {
      void verify(code)
      return
    }
    if (Array.from(newPassword).length < 8) {
      setError("Password must contain at least 8 characters.")
      return
    }
    const passwordBytes = encodeURIComponent(newPassword).replace(/%[0-9A-F]{2}/gi, "x").length
    if (passwordBytes > 72) {
      setError("Password must not exceed 72 UTF-8 bytes.")
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
      Observe.reportError(cause)
      if (!mounted.current) return
      setError(cause instanceof Error ? cause.message : "Could not reset your password.")
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
