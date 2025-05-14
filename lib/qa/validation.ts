import { z } from "zod"

export const qaTagSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Tag name is required and must be at least 2 characters")
        .max(30, "Tag name cannot exceed 30 characters")
        .regex(/^[a-z0-9-]+$/, "Tag can only contain lowercase letters, numbers, and hyphens"),
})

export const questionSchema = z.object({
    title: z
        .string()
        .min(5, "Title is required and must be at least 5 characters")
        .max(255, "Title must be less than 255 characters"),
    content: z
        .string()
        .min(20, "Content is required and must be at least 20 characters"),
    tags: z
        .array(z.string())
        .min(1, "Select at least one tag"),
    status: z
        .enum(["OPEN", "CLOSED"], {
            required_error: "Status is required",
        })
        .optional(),
})

export const answerSchema = z.object({
    content: z
        .string()
        .min(20, "Answer content is required and must be at least 20 characters"),
    questionId: z
        .string()
        .min(1, "Question ID is required"),
})

export type QaTagFormValues = z.infer<typeof qaTagSchema>
export type QuestionFormValues = z.infer<typeof questionSchema>
export type AnswerFormValues = z.infer<typeof answerSchema>
