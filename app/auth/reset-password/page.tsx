"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { resetPasswordWithConfirmSchema } from "@/lib/validations"
import { AuthCard } from "@/components/auth/auth-card"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordRequirements } from "@/components/auth/password-requirements"
import { resetPasswordServices } from "@/services/auth/resetPassword.services"
import { ApiError } from "@/lib/api/baseAPI"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setAuthError, clearError } from "@/redux/slices/authSlice"

type ResetPasswordValues = z.infer<typeof resetPasswordWithConfirmSchema>

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const emailFromQuery = searchParams.get("email") || ""
  const codeFromQuery = searchParams.get("code") || ""

  const { error } = useSelector(
    (state: RootState) => state.auth
  )

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordWithConfirmSchema),
    defaultValues: {
      email: emailFromQuery,
      code: codeFromQuery,
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (error) {
      toast.error('Error', {
        description: error,
      })
      dispatch(clearError())
    }
  }, [error, dispatch])

  async function onSubmit(values: ResetPasswordValues) {
    setIsLoading(true)

    try {
      const resetData = {
        email: values.email,
        code: values.code,
        newPassword: values.newPassword,
      }

      await resetPasswordServices.resetPassword(resetData)

      toast.success("Password reset successful", {
        description: "You can now sign in with your new password"
      })

      setIsSuccess(true)
    } catch (error) {
      const apiError = error as ApiError
      dispatch(setAuthError(apiError.message || "Failed to reset password"))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <AuthCard title="Password reset successful" description="Your password has been reset successfully">
        <Button className="w-full mt-4" onClick={() => (router.push("/auth/signin"))}>
          Back to sign in
        </Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Reset password" description="Enter your new password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
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
                <FormLabel>Verification code *</FormLabel>
                <FormControl>
                  <div className="flex justify-center w-full">
                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password *</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <PasswordRequirements password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password *</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? "Resetting password..." : "Reset password"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  )
}