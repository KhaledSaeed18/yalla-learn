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
import { setAuthData, setAuthError, clearError, setPendingTwoFactor } from "@/redux/slices/authSlice"
import { toast } from "sonner"
import { authServices } from "@/services/auth/signin.services"
import { ApiError } from "@/lib/api/baseAPI"
import { Loader2, LogIn } from "lucide-react"
import { TwoFactorAuthForm } from "@/components/auth/two-factor-auth-form"

type SignInValues = z.infer<typeof signinSchema>

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const { error, pendingTwoFactor } = useSelector(
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

      // Check if 2FA is required
      if (response.status === "pending" && 'requiresOtp' in response.data) {
        // Store credentials for the 2FA step
        dispatch(
          setPendingTwoFactor({
            email: values.email,
            password: values.password,
            userId: response.data.user.id
          })
        )
        toast.info("2FA Required", {
          description: "Please enter the code from your authenticator app",
        })
      } else if ('accessToken' in response.data) {
        // Standard sign-in flow with successful authentication
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
      }
    } catch (error) {
      const apiError = error as ApiError
      dispatch(setAuthError(apiError.message || "Failed to sign in"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthCard
        title={pendingTwoFactor.isRequired ? "Verification Required" : "Welcome back"}
        description={pendingTwoFactor.isRequired
          ? "Please enter the 6-digit code from your authenticator app"
          : "Sign in to your account"
        }
      >
        {pendingTwoFactor.isRequired ? (
          <TwoFactorAuthForm />
        ) : (
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
                {isLoading ?
                  <>
                    <Loader2 className="animate-spin mr-1" />
                    {"Signing in..."}
                  </>
                  :
                  <>
                    <LogIn className="mr-1" />
                    {"Sign in"}
                  </>
                }
              </Button>
            </form>
          </Form>
        )}
      </AuthCard>

      <AuthFooter text="Don't have an account?" linkText="Sign up" linkHref="/auth/signup" />
    </>
  )
}