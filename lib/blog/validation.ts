import { z } from "zod"

export const blogCategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Category name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
})

export const blogPostSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
    slug: z.string(),
    content: z.string(),
    excerpt: z.string().max(300, "Excerpt must be less than 300 characters").optional(),
    thumbnail: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED"], {
        required_error: "Status is required",
    }),
    readTime: z.coerce.number().min(0).optional(),
    categories: z.array(z.string()).min(1, "Select at least one category"),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>

