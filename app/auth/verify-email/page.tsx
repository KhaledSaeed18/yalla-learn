"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { resendVerificationSchema, verifyEmailSchema } from "@/lib/validations"
import { AuthCard } from "@/components/auth/auth-card"


type VerifyEmailValues = z.infer<typeof verifyEmailSchema>

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const emailFromQuery = searchParams.get("email") || ""

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: emailFromQuery,
      code: "",
    },
  })

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  async function onSubmit(values: VerifyEmailValues) {
    setIsLoading(true)

    try {
      // Here you would implement your verification logic
      console.log(values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard or home page
      window.location.href = "/"
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendCode() {
    setIsResending(true)

    try {
      const email = form.getValues("email")
      const validationResult = resendVerificationSchema.safeParse({ email })

      if (!validationResult.success) {
        console.error("Invalid email for resend")
        return
      }

      // Here you would implement your resend code logic
      console.log({ email })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Start countdown
      setCountdown(60)
    } catch (error) {
      console.error(error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthCard title="Verify your email" description="We've sent a verification code to your email">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                    readOnly={!!emailFromQuery}
                    className={emailFromQuery ? "bg-muted" : ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              size="sm"
              className="px-0"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : isResending ? "Sending..." : "Resend verification code"}
            </Button>
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify email"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}

