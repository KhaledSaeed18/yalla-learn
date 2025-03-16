"use client"

import type React from "react"
import { useState } from "react"
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

const generalFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
})

const passwordFormSchema = z
    .object({
        currentPassword: z.string().min(1, { message: "Current password is required" }),
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

    const generalForm = useForm<GeneralFormValues>({
        resolver: zodResolver(generalFormSchema),
        defaultValues: {
            name: "John Doe",
            email: "john.doe@example.com",
        },
    })

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    function onGeneralSubmit(data: GeneralFormValues) {
        console.log("General form submitted:", data)
        toast.success("Profile updated", {
            description: "Your profile information has been updated successfully.",
        })
        // toast.warning("Profile updated", {
        //     description: "Your profile information has been updated successfully.",
        // })
        // toast.error("Profile updated", {
        //     description: "Your profile information has been updated successfully.",
        // })
        // toast.info("Profile updated", {
        //     description: "Your profile information has been updated successfully.",
        // })
    }

    function onPasswordSubmit(data: PasswordFormValues) {
        console.log("Password form submitted:", data)
        toast.success("Password updated", {
            description: "Your password has been updated successfully.",
        })

        passwordForm.reset()
    }

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0])
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 cursor-pointer">
                    <TabsTrigger value="general" className="cursor-pointer">
                        General
                    </TabsTrigger>
                    <TabsTrigger value="password" className="cursor-pointer">
                        Password
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
                                                src={avatarFile ? URL.createObjectURL(avatarFile) : undefined}
                                                alt="Profile picture"
                                            />
                                            <AvatarFallback>
                                                {generalForm
                                                    .watch("name")
                                                    .split(" ")
                                                    .map((name) => name[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .substring(0, 2)}
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

                                    <FormField
                                        control={generalForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={generalForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter your email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={!generalForm.formState.isDirty}>
                                        Save changes
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
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        error={!!passwordForm.formState.errors.currentPassword}
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
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={!passwordForm.formState.isDirty}>
                                        Update Password
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

