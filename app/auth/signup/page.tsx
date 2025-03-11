"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signupSchema } from "@/lib/validations"
import { AuthCard } from "@/components/auth/auth-card"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordRequirements } from "@/components/auth/password-requirements"
import { AuthFooter } from "@/components/auth/auth-footer"
import { useRouter } from "next/navigation"

type SignUpValues = z.infer<typeof signupSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignUpValues) {
    setIsLoading(true)

    try {
      console.log(values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthCard title="Create an account" description="Enter your information to create an account">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <PasswordRequirements password={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
      </AuthCard>

      <AuthFooter text="Already have an account?" linkText="Sign in" linkHref="/auth/signin" />
    </>
  )
}

