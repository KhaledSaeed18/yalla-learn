import { z } from "zod";
import { TaskPriority } from "@/types/kanban/kanban.types";

export const boardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Board title is required and must be at least 3 characters")
        .max(50, "Board title cannot exceed 50 characters"),
});

export const columnSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Column title is required and must be at least 1 character")
        .max(30, "Column title cannot exceed 30 characters"),
    isDefault: z
        .boolean()
        .optional(),
    order: z
        .number()
        .int()
        .min(0, "Order must be a non-negative integer")
        .optional(),
});

export const taskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Task title is required")
        .max(100, "Task title cannot exceed 100 characters"),
    description: z
        .string()
        .trim()
        .max(1000, "Description cannot exceed 1000 characters")
        .optional()
        .nullable(),
    priority: z
        .enum(["LOW", "MEDIUM", "HIGH", "URGENT"] as const, {
            required_error: "Priority is required",
        }),
    dueDate: z
        .string()
        .datetime({ message: "Due date must be a valid ISO8601 date string" })
        .optional()
        .nullable(),
});

export type BoardFormValues = z.infer<typeof boardSchema>;
export type ColumnFormValues = z.infer<typeof columnSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
