"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthFooter } from "@/components/auth/auth-footer"
import { forgotPasswordSchema } from "@/lib/validations"
import Link from "next/link"
import { forgotPasswordServices } from "@/services/auth/forgotPassword.services"
import { ApiError } from "@/lib/api/baseAPI"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setAuthError, clearError } from "@/redux/slices/authSlice"

type ForgetPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const dispatch = useDispatch()

  const { error } = useSelector(
    (state: RootState) => state.auth
  )

  const form = useForm<ForgetPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
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

  async function onSubmit(values: ForgetPasswordValues) {
    setIsLoading(true)

    try {
      await forgotPasswordServices.forgotPassword(values)

      toast.success("Reset instructions sent", {
        description: "Check your email for the verification code"
      })

      setSubmittedEmail(values.email)
      setIsSubmitted(true)
    } catch (error) {
      const apiError = error as ApiError
      dispatch(setAuthError(apiError.message || "Failed to send reset instructions"))
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <AuthCard title="Check your email" description="We've sent a 6-digit verification code to your email address">
        <div className="space-y-4 mt-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-2">What happens next?</h3>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Check your email for a message from us</li>
              <li>Find the 6-digit verification code in the email</li>
              <li>Use this code on the <b>password reset page</b></li>
              <li>Create your new password</li>
            </ol>
          </div>

          <div className="mt-4">
            <Link href={`/auth/reset-password?email=${encodeURIComponent(submittedEmail)}`}>
              <Button variant="outline" className="w-full">
                Continue to Password Reset
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            If you don't see it, check your spam folder or
          </p>
          <div className="flex justify-center">
            <Button variant="link" className="p-0" onClick={() => setIsSubmitted(false)}>
              try another email address
            </Button>
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <>
      <AuthCard title="Forgot password" description="Enter your email address and we'll send you a 6-digit verification code">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Sending reset code..." : "Send reset code"}
            </Button>
          </form>
        </Form>
      </AuthCard>

      <AuthFooter text="Remember your password?" linkText="Back to sign in" linkHref="/auth/signin" />
    </>
  )
}