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
      <AuthCard title="Check your email" description="We've sent a password reset link to your email address">
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">If you don't see it, check your spam folder or</p>
          <Button variant="link" className="mt-1 p-0" onClick={() => setIsSubmitted(false)}>
            try another email address
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <>
      <AuthCard title="Forgot password" description="Enter your email address and we'll send you a reset link">
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

