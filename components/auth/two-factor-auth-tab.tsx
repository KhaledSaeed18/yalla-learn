import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Shield, ShieldCheck } from "lucide-react";

import { userServices } from "@/services/user/user.services";
import { twoFactorSetupSchema, twoFactorDisableSchema } from "@/lib/auth/twoFactorValidations";
import {
    setTwoFactorSetup,
    clearTwoFactorSetup,
    updateTwoFactorStatus
} from "@/redux/slices/authSlice";
import {
    TwoFactorVerifyRequest,
    TwoFactorDisableRequest
} from "@/types/auth/twoFactorAuth.types";

// Define form value types
type SetupFormValues = {
    token: string;
};

type DisableFormValues = {
    token: string;
};

export function TwoFactorAuthTab() {
    const dispatch = useDispatch();
    const { twoFactorSetup } = useSelector((state: any) => state.auth);
    const [setupMode, setSetupMode] = useState<boolean>(false);

    // Fetch 2FA status
    const statusQuery = useQuery({
        queryKey: ['2fa-status'],
        queryFn: async () => {
            const response = await userServices.check2FAStatus();
            return response.data.totpEnabled;
        }
    });

    // Setup 2FA mutation
    const setupMutation = useMutation({
        mutationFn: async () => {
            const response = await userServices.setup2FA();
            return response.data;
        },
        onSuccess: (data) => {
            if (data) {
                dispatch(setTwoFactorSetup({
                    secret: data.secret,
                    qrCode: data.qrCode
                }));
                setSetupMode(true);
                toast.success("2FA setup initiated", {
                    description: "Please scan the QR code with your authenticator app and enter the token.",
                });
            }
        },
        onError: (error: any) => {
            toast.error("Failed to setup 2FA", {
                description: error.message || "An unexpected error occurred.",
            });
        }
    });

    // Verify 2FA mutation
    const verifyMutation = useMutation({
        mutationFn: (data: TwoFactorVerifyRequest) => userServices.verify2FA(data),
        onSuccess: () => {
            dispatch(clearTwoFactorSetup());
            setSetupMode(false);
            toast.success("2FA enabled successfully", {
                description: "Two-factor authentication has been enabled for your account.",
            });
            // Update 2FA status in Redux
            dispatch(updateTwoFactorStatus({ isEnabled: true }));
            // Refetch the status
            statusQuery.refetch();
        },
        onError: (error: any) => {
            toast.error("Failed to verify 2FA token", {
                description: error.message || "An unexpected error occurred.",
            });
        }
    });

    // Disable 2FA mutation
    const disableMutation = useMutation({
        mutationFn: (data: TwoFactorDisableRequest) => userServices.disable2FA(data),
        onSuccess: () => {
            toast.success("2FA disabled successfully", {
                description: "Two-factor authentication has been disabled for your account.",
            });
            // Update 2FA status in Redux
            dispatch(updateTwoFactorStatus({ isEnabled: false }));
            // Refetch the status
            statusQuery.refetch();
        },
        onError: (error: any) => {
            toast.error("Failed to disable 2FA", {
                description: error.message || "An unexpected error occurred.",
            });
        }
    });

    // Setup form
    const setupForm = useForm<SetupFormValues>({
        resolver: zodResolver(twoFactorSetupSchema),
        defaultValues: {
            token: "",
        },
    });

    // Disable form
    const disableForm = useForm<DisableFormValues>({
        resolver: zodResolver(twoFactorDisableSchema),
        defaultValues: {
            token: "",
        },
    });

    // Handle setup form submission
    function onSetupSubmit(data: SetupFormValues) {
        verifyMutation.mutate(data);
    }

    // Handle disable form submission
    function onDisableSubmit(data: DisableFormValues) {
        disableMutation.mutate(data);
    }

    // Initialize setup
    const handleInitSetup = () => {
        setupMutation.mutate();
    };

    // Cancel setup
    const handleCancelSetup = () => {
        dispatch(clearTwoFactorSetup());
        setSetupMode(false);
    };

    // Reset form on unmount
    useEffect(() => {
        return () => {
            if (setupMode) {
                dispatch(clearTwoFactorSetup());
            }
        };
    }, [dispatch, setupMode]);

    // Render loading state
    if (statusQuery.isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                        Secure your account with two-factor authentication.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-8">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading 2FA status...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Render 2FA status and controls
    const render2FAStatus = () => {
        const is2FAEnabled = statusQuery.data;

        if (setupMode) {
            return (
                <div className="space-y-6">
                    <Alert className="bg-yellow-50">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800">Setup in progress</AlertTitle>
                        <AlertDescription className="text-yellow-700">
                            Complete the setup by scanning the QR code and entering the verification token.
                        </AlertDescription>
                    </Alert>

                    <div className="flex flex-col items-center space-y-4">
                        <h3 className="text-lg font-medium">Scan QR Code</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>

                        {twoFactorSetup.qrCode ? (
                            <div className="border p-4 rounded-md bg-white">
                                <Image
                                    src={twoFactorSetup.qrCode}
                                    alt="2FA QR Code"
                                    width={200}
                                    height={200}
                                    className="mx-auto"
                                />
                            </div>
                        ) : (
                            <div className="animate-pulse h-48 w-48 bg-gray-200 rounded-md"></div>
                        )}

                        <div className="w-full max-w-sm mt-6">
                            <Form {...setupForm}>
                                <form onSubmit={setupForm.handleSubmit(onSetupSubmit)} className="space-y-4">
                                    <FormField
                                        control={setupForm.control}
                                        name="token"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Verification Token</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter 6-digit token"
                                                        maxLength={6}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter the 6-digit code from your authenticator app.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex space-x-2">
                                        <Button
                                            type="submit"
                                            disabled={verifyMutation.isPending}
                                            className="flex-1"
                                        >
                                            {verifyMutation.isPending ? "Verifying..." : "Verify Token"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancelSetup}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>

                        <div className="mt-4 p-4 bg-gray-50 rounded-md w-full max-w-sm">
                            <h4 className="text-sm font-medium mb-2">Manual entry</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                                If you can't scan the QR code, enter this key manually in your app:
                            </p>
                            <div className="bg-white p-2 rounded border text-sm font-mono break-all">
                                {twoFactorSetup.secret}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (is2FAEnabled) {
            return (
                <div className="space-y-6">
                    <Alert className="bg-green-50">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-800">Two-Factor Authentication is Enabled</AlertTitle>
                        <AlertDescription className="text-green-700">
                            Your account is secured with two-factor authentication.
                        </AlertDescription>
                    </Alert>

                    <div className="max-w-sm">
                        <Form {...disableForm}>
                            <form onSubmit={disableForm.handleSubmit(onDisableSubmit)} className="space-y-4">
                                <FormField
                                    control={disableForm.control}
                                    name="token"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verification Token</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter 6-digit token"
                                                    maxLength={6}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Enter the current token from your authenticator app to disable 2FA.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={disableMutation.isPending}
                                >
                                    {disableMutation.isPending ? "Disabling..." : "Disable Two-Factor Authentication"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <Alert className="bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Two-Factor Authentication is Disabled</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Enable two-factor authentication to add an extra layer of security to your account.
                    </AlertDescription>
                </Alert>

                <div className="flex flex-col space-y-4">
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>
                            Two-factor authentication adds an extra layer of security to your account by requiring
                            a verification code from your phone in addition to your password.
                        </p>
                        <p>
                            After enabling, you'll need to enter a verification code from an authenticator app each time you log in.
                        </p>
                    </div>

                    <Button
                        onClick={handleInitSetup}
                        disabled={setupMutation.isPending}
                        className="w-full md:w-auto"
                    >
                        {setupMutation.isPending ? "Initializing..." : "Enable Two-Factor Authentication"}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                    Secure your account with two-factor authentication.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {render2FAStatus()}
            </CardContent>
            {statusQuery.isError && (
                <CardFooter>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            Failed to load 2FA status. Please try refreshing the page.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            )}
        </Card>
    );
}
