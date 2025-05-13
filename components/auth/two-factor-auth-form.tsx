import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { twoFactorSigninSchema } from "@/lib/auth/validations";
import { TwoFactorSignInRequest } from "@/types/auth/signin.types";
import { authServices } from "@/services/auth/signin.services";
import { setAuthData, clearPendingTwoFactor, setAuthError } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { ApiError } from "@/lib/api/baseAPI";

export function TwoFactorAuthForm() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const { pendingTwoFactor } = useSelector((state: RootState) => state.auth);

    const form = useForm<TwoFactorSignInRequest>({
        resolver: zodResolver(twoFactorSigninSchema),
        defaultValues: {
            email: pendingTwoFactor.email || "",
            password: pendingTwoFactor.password || "",
            token: "",
        },
    });

    async function onSubmit(values: TwoFactorSignInRequest) {
        setIsLoading(true);

        try {
            const response = await authServices.twoFactorSignIn(values);

            // Type guard for successful authentication response
            if ('accessToken' in response.data) {
                dispatch(
                    setAuthData({
                        user: response.data.user,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    })
                );

                // Clear the pending state
                dispatch(clearPendingTwoFactor());

                toast.success("Welcome back!", {
                    description: "Authenticated successfully",
                });

                router.push("/dashboard");
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            const apiError = error as ApiError;
            dispatch(setAuthError(apiError.message || "Failed to verify code"));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Authentication Code *</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-1" />
                            {"Verifying..."}
                        </>
                    ) : (
                        <>
                            <Shield className="mr-1" />
                            {"Verify & Sign in"}
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}
