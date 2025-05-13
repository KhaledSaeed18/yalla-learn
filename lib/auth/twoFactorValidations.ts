import { z } from "zod";

export const twoFactorSetupSchema = z.object({
    token: z
        .string()
        .trim()
        .length(6, "Token must be 6 digits")
        .regex(/^\d{6}$/, "Token must contain only digits"),
});

export const twoFactorDisableSchema = z.object({
    token: z
        .string()
        .trim()
        .length(6, "Token must be 6 digits")
        .regex(/^\d{6}$/, "Token must contain only digits"),
});
