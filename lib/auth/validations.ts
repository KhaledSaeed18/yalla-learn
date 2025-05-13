import { z } from "zod"

// Block common disposable email domains
export const BLOCKED_DOMAINS = [
    "test.com",
    "example.com",
    "localhost.com",
    "tempmail.com",
    "throwaway.com",
    "mailinator.com",
    "guerrillamail.com",
    "yopmail.com",
    "temp-mail.org",
    "fakeinbox.com",
    "10minutemail.com",
    "trashmail.com",
    "sharklasers.com",
    "mailnesia.com",
    "disposable.com",
    "getnada.com",
    "dispostable.com",
    "maildrop.cc",
]

// Commonly used passwords should be avoided
export const COMMON_PASSWORDS = [
    "Password123!",
    "Admin123!",
    "P@ssw0rd",
    "P@ssw0rd2024",
    "P@ssw0rd2025",
    "Qwerty123!",
    "Welcome123!",
    "Secret123!",
    "Letmein123!",
    "ABC123abc!",
    "12345678Aa!",
    "Password1!",
    "Abcd1234!",
    "Login1234!",
    "Winter2025!",
    "Summer2025!",
    "Spring2025!",
    "Fall2025!",
    "Pa$$w0rd",
    "Adm1n123!",
    "L0g1n!123",
    "W3lc0me!",
    "Ch4ng3m3!",
]

// Signup schema
export const signupSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(50, "First name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(50, "Last name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

    email: z
        .string()
        .trim()
        .email("Invalid email format")
        .refine((email) => {
            const parts = email.split("@");
            if (parts.length !== 2) return true;
            const domain = parts[1];
            return domain && !BLOCKED_DOMAINS.includes(domain.toLowerCase());
        }, "This email domain is not allowed. Please use a different email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password cannot exceed 64 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
        .refine(
            (password) => !COMMON_PASSWORDS.includes(password),
            "This password is too common. Please choose a more unique password.",
        ),
})

// Signin schema
export const signinSchema = z.object({
    email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),

    password: z.string().min(1, "Password is required").max(64, "Password exceeds maximum length"),
})

// Two-factor signin schema
export const twoFactorSigninSchema = signinSchema.extend({
    token: z
        .string()
        .trim()
        .length(6, "Token must be 6 digits")
        .regex(/^\d{6}$/, "Token must contain only digits"),
})

// Email verification schema
export const verifyEmailSchema = z.object({
    email: z.string().trim().email("Invalid email format"),

    code: z
        .string()
        .trim()
        .length(6, "Verification code must be 6 digits")
        .regex(/^\d{6}$/, "Verification code must contain only digits"),
})

// Resend verification schema
export const resendVerificationSchema = z.object({
    email: z.string().trim().email("Invalid email format"),
})

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Invalid email format"),
})

// Reset password schema
export const resetPasswordSchema = z.object({
    email: z.string().trim().email("Invalid email format"),

    code: z
        .string()
        .trim()
        .length(6, "Reset code must be 6 digits")
        .regex(/^\d{6}$/, "Reset code must contain only digits"),

    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters long")
        .max(64, "New password cannot exceed 64 characters")
        .regex(/[a-z]/, "New password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
        .regex(/[0-9]/, "New password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "New password must contain at least one special character")
        .refine(
            (password) => !COMMON_PASSWORDS.includes(password),
            "This password is too common. Please choose a more unique password.",
        ),
})

// Extended reset password schema with password confirmation
export const resetPasswordWithConfirmSchema = resetPasswordSchema
    .extend({
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

