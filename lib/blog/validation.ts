import { z } from "zod"

export const categorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name is required and must be at least 2 characters")
        .max(50, "Category name cannot exceed 50 characters"),
    slug: z
        .string()
        .trim()
        .min(2, "Slug is required and must be at least 2 characters")
        .max(100, "Slug cannot exceed 100 characters")
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
        .nullable(),
})

export const blogPostSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must be less than 255 characters"),
    slug: z
        .string(),
    content: z
        .string()
        .min(1, "Content is required"),
    excerpt: z
        .string()
        .max(300, "Excerpt must be less than 300 characters")
        .optional(),
    thumbnail: z
        .string()
        .optional(),
    status: z.
        enum(["DRAFT", "PUBLISHED"], {
            required_error: "Status is required",
        }),
    readTime: z
        .coerce
        .number()
        .min(0)
        .optional(),
    categories: z
        .array(z.string())
        .min(1, "Select at least one category"),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>

