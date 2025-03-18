"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signinSchema } from "@/lib/auth/validations"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthFooter } from "@/components/auth/auth-footer"
import { PasswordInput } from "@/components/auth/password-input"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setAuthData, setAuthError, clearError } from "@/redux/slices/authSlice"
import { toast } from "sonner"
import { authServices } from "@/services/auth/signin.services"
import { ApiError } from "@/lib/api/baseAPI"

type SignInValues = z.infer<typeof signinSchema>

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const { error } = useSelector(
    (state: RootState) => state.auth
  )

  const form = useForm<SignInValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
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

  async function onSubmit(values: SignInValues) {
    setIsLoading(true)

    try {
      const response = await authServices.signIn(values)

      dispatch(
        setAuthData({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      )
      toast.success("Welcome back!", {
        description: "Signed in successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      const apiError = error as ApiError
      dispatch(setAuthError(apiError.message || "Failed to sign in"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthCard title="Welcome back" description="Sign in to your account">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password *</FormLabel>
                    <Link href="/auth/forget-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </AuthCard>

      <AuthFooter text="Don't have an account?" linkText="Sign up" linkHref="/auth/signup" />
    </>
  )
}