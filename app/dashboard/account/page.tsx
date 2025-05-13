"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { PasswordInput } from "@/components/auth/password-input"
import { PasswordRequirements } from "@/components/auth/password-requirements"
import { COMMON_PASSWORDS } from "@/lib/auth/validations"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userServices } from "@/services/user/user.services"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { updateUser } from "@/redux/slices/authSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { TwoFactorAuthTab } from "@/components/auth/two-factor-auth-tab"

const generalFormSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(1, { message: "Last name must be at least 1 character" }),
    email: z.string().email({ message: "Please enter a valid email address" }).optional(),
    bio: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    phoneNumber: z.string().optional().nullable(),
})

const passwordFormSchema = z
    .object({
        oldPassword: z.string().min(1, { message: "Current password is required" }),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(64, "Password cannot exceed 64 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
            .refine(
                (password) => !COMMON_PASSWORDS.includes(password),
                "This password is too common. Please choose a more unique password."
            ),
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

type GeneralFormValues = z.infer<typeof generalFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export default function AccountPage() {
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const router = useRouter()
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

    // Fetch user profile data
    const { data: profileData, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await userServices.getUserProfile()
            return response.data.user
        }
    })

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (data: GeneralFormValues) => userServices.updateProfile(data),
        onSuccess: (response, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] })

            // Update Redux store with the new user data
            dispatch(updateUser({
                firstName: variables.firstName,
                lastName: variables.lastName,
                bio: variables.bio,
                location: variables.location,
                phoneNumber: variables.phoneNumber
            }))

            toast.success("Profile updated", {
                description: "Your profile information has been updated successfully.",
            })
        },
        onError: (error: any) => {
            toast.error("Failed to update profile", {
                description: error.message || "An unexpected error occurred.",
            })
        }
    })

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: (data: { oldPassword: string, newPassword: string }) =>
            userServices.changePassword(data),
        onSuccess: () => {
            toast.success("Password updated", {
                description: "Your password has been updated successfully.",
            })
            passwordForm.reset()
        },
        onError: (error: any) => {
            toast.error("Failed to change password", {
                description: error.message || "An unexpected error occurred.",
            })
        }
    })

    // Delete account mutation
    const deleteAccountMutation = useMutation({
        mutationFn: () => userServices.deleteAccount(),
        onSuccess: () => {
            toast.success("Account deleted", {
                description: "Your account has been deleted successfully.",
            })
            dispatch(updateUser(null))
            queryClient.clear()
            router.push("/")
        },
        onError: (error: any) => {
            toast.error("Failed to delete account", {
                description: error.message || "An unexpected error occurred.",
            })
        }
    })

    const generalForm = useForm<GeneralFormValues>({
        resolver: zodResolver(generalFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            bio: "",
            location: "",
            phoneNumber: "",
        },
    })

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    // Update form with user data when it loads
    useEffect(() => {
        if (profileData) {
            generalForm.reset({
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
                bio: profileData.bio,
                location: profileData.location,
                phoneNumber: profileData.phoneNumber || "",
            })
        }
    }, [profileData, generalForm])

    function onGeneralSubmit(data: GeneralFormValues) {
        updateProfileMutation.mutate(data)
    }

    function onPasswordSubmit(data: PasswordFormValues) {
        changePasswordMutation.mutate({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        })
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0])
            // Here you would typically upload the avatar to your backend
            // This is a placeholder for that functionality
            toast.info("Avatar uploading is not fully implemented yet")
        }
    }

    function handleDeleteAccount() {
        deleteAccountMutation.mutate()
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="w-full max-w-4xl mx-auto">
                    <Skeleton className="h-10 w-full mb-8 rounded-lg" />
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-3/12" />
                                <Skeleton className="h-4 w-6/12" />
                            </div>
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex justify-end border-t">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 cursor-pointer">
                    <TabsTrigger value="general" className="cursor-pointer">
                        General
                    </TabsTrigger>
                    <TabsTrigger value="password" className="cursor-pointer">
                        Password
                    </TabsTrigger>
                    <TabsTrigger value="2fa" className="cursor-pointer">
                        Two-Factor Auth
                    </TabsTrigger>
                    <TabsTrigger value="danger" className="cursor-pointer">
                        Danger Zone
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <Form {...generalForm}>
                            <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
                                <CardHeader className="mb-2">
                                    <CardTitle>General Information</CardTitle>
                                    <CardDescription>Update your account details here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 mb-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="w-24 h-24">
                                            <AvatarImage
                                                src={avatarFile ? URL.createObjectURL(avatarFile) : profileData?.avatar || undefined}
                                                alt="Profile picture"
                                            />
                                            <AvatarFallback>
                                                {profileData ?
                                                    `${profileData.firstName[0]}${profileData.lastName[0]}` :
                                                    "NA"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <Label htmlFor="avatar" className="cursor-pointer">
                                                <Button variant="outline" className="mt-2" type="button">
                                                    Change Avatar
                                                </Button>
                                            </Label>
                                            <Input
                                                id="avatar"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            control={generalForm.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your first name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={generalForm.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your last name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={generalForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        {...field}
                                                        disabled
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={generalForm.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us about yourself"
                                                        {...field}
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <FormField
                                            control={generalForm.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your location"
                                                            {...field}
                                                            value={field.value || ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={generalForm.control}
                                            name="phoneNumber"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <FormLabel>Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your phone number"
                                                            {...field}
                                                            value={field.value || ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        disabled={!generalForm.formState.isDirty || updateProfileMutation.isPending}
                                    >
                                        {updateProfileMutation.isPending ? "Saving..." : "Save changes"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>

                <TabsContent value="password">
                    <Card>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                                <CardHeader className="mb-2">
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your password here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 mb-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="oldPassword"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        error={!!passwordForm.formState.errors.oldPassword}
                                                        placeholder="Enter your current password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        error={!!passwordForm.formState.errors.newPassword}
                                                        placeholder="Enter your new password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                <PasswordRequirements password={field.value} />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        error={!!passwordForm.formState.errors.confirmPassword}
                                                        placeholder="Confirm your new password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="submit"
                                        disabled={!passwordForm.formState.isDirty || changePasswordMutation.isPending}
                                    >
                                        {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>

                <TabsContent value="2fa">
                    <TwoFactorAuthTab />
                </TabsContent>

                <TabsContent value="danger">
                    <Card className="border-red-200">
                        <CardHeader className="mb-2">
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>
                                These actions are irreversible. Please proceed with caution.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 mb-4">
                            <div className="rounded-md border border-red-200 p-4">
                                <h3 className="text-lg font-medium">Delete Account</h3>
                                <p className="text-sm text-gray-500 mt-2 mb-4">
                                    Once you delete your account, there is no going back. All of your data will be permanently removed.
                                </p>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete Account</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove all of your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-red-600 hover:bg-red-700"
                                                onClick={handleDeleteAccount}
                                                disabled={deleteAccountMutation.isPending}
                                            >
                                                {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

