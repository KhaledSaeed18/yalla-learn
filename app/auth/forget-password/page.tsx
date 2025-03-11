"use client"

import { useState } from "react"
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

type ForgetPasswordValues = z.infer<typeof forgotPasswordSchema>

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ForgetPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: ForgetPasswordValues) {
    setIsLoading(true)

    try {
      // Here you would implement your forget password logic
      console.log(values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setIsSubmitted(true)
    } catch (error) {
      console.error(error)
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
            <Link href="/auth/reset-password">
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
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        </Form>
      </AuthCard>

      <AuthFooter text="Remember your password?" linkText="Back to sign in" linkHref="/auth/signin" />
    </>
  )
}

