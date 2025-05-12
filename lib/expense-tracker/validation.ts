import { z } from "zod"
import {
    PaymentMethod,
    BudgetPeriod,
    Term,
    UniversityPaymentType
} from "@/types/expense-tracker/expenseTracker.types"

// Expense Category Validation Schema
export const expenseCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name is required")
        .max(50, "Category name cannot exceed 50 characters"),
    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters")
        .optional()
        .nullable(),
    icon: z
        .string()
        .trim()
        .max(50, "Icon identifier cannot exceed 50 characters")
        .optional()
        .nullable(),
    isDefault: z
        .boolean()
        .optional(),
    color: z
        .string()
        .trim()
        .max(20, "Color code cannot exceed 20 characters")
        .optional()
        .nullable()
})

// Expense Validation Schema
export const expenseSchema = z.object({
    amount: z
        .number()
        .min(0.01, "Amount must be greater than 0")
        .refine((val) => val > 0, {
            message: "Amount must be a positive number",
        }),
    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters")
        .optional()
        .nullable(),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
    categoryId: z
        .string()
        .min(1, "Category is required"),
    paymentMethod: z
        .enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "MOBILE_PAYMENT", "SCHOLARSHIP", "OTHER"] as const)
        .optional()
        .nullable(),
    location: z
        .string()
        .trim()
        .max(100, "Location cannot exceed 100 characters")
        .optional()
        .nullable(),
    semesterId: z
        .string()
        .optional()
        .nullable()
})

// Income Validation Schema
export const incomeSchema = z.object({
    amount: z
        .number()
        .min(0.01, "Amount must be greater than 0")
        .refine((val) => val > 0, {
            message: "Amount must be a positive number",
        }),
    source: z
        .string()
        .trim()
        .min(1, "Source is required")
        .max(100, "Source cannot exceed 100 characters"),
    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters")
        .optional()
        .nullable(),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
    recurring: z
        .boolean()
        .optional()
})

// Budget Validation Schema
export const budgetSchema = z.object({
    amount: z
        .number()
        .min(0.01, "Amount must be greater than 0")
        .refine((val) => val > 0, {
            message: "Amount must be a positive number",
        }),
    period: z
        .enum(["DAILY", "WEEKLY", "MONTHLY", "SEMESTER", "YEARLY"] as const, {
            required_error: "Budget period is required",
        }),
    startDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid start date format",
        }),
    endDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid end date format",
        })
        .optional()
        .nullable(),
    categoryId: z
        .string()
        .min(1, "Category is required"),
    semesterId: z
        .string()
        .optional()
        .nullable()
})

// Semester Validation Schema
export const semesterSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Semester name is required")
        .max(100, "Semester name cannot exceed 100 characters"),
    startDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid start date format",
        }),
    endDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid end date format",
        }),
    year: z
        .number()
        .min(2000, "Year must be 2000 or later")
        .max(2100, "Year must be 2100 or earlier"),
    term: z
        .enum(["FALL", "SPRING", "SUMMER"] as const, {
            required_error: "Term is required",
        }),
    isActive: z
        .boolean()
        .optional()
})

// Payment Schedule Validation Schema
export const paymentScheduleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Payment name is required")
        .max(100, "Payment name cannot exceed 100 characters"),
    amount: z
        .number()
        .min(0.01, "Amount must be greater than 0")
        .refine((val) => val > 0, {
            message: "Amount must be a positive number",
        }),
    dueDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid due date format",
        }),
    isPaid: z
        .boolean()
        .optional(),
    paidDate: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid paid date format",
        })
        .optional()
        .nullable(),
    semesterId: z
        .string()
        .min(1, "Semester is required"),
    paymentType: z
        .enum(["TUITION", "HOUSING", "MEAL_PLAN", "BOOKS", "LAB_FEES", "ACTIVITY_FEES", "TECHNOLOGY_FEES", "INSURANCE", "PARKING", "OTHER"] as const, {
            required_error: "Payment type is required",
        }),
    notes: z
        .string()
        .trim()
        .max(500, "Notes cannot exceed 500 characters")
        .optional()
        .nullable()
})

// Savings Goal Validation Schema
export const savingsGoalSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Goal name is required")
        .max(100, "Goal name cannot exceed 100 characters"),
    targetAmount: z
        .number()
        .min(0.01, "Target amount must be greater than 0")
        .refine((val) => val > 0, {
            message: "Target amount must be a positive number",
        }),
    currentAmount: z
        .number()
        .min(0, "Current amount cannot be negative")
        .optional(),
    startDate: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid start date format",
        })
        .optional()
        .nullable(),
    targetDate: z
        .string()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid target date format",
        })
        .optional()
        .nullable(),
    isCompleted: z
        .boolean()
        .optional()
})

// Type inferences for form values
export type ExpenseCategoryFormValues = z.infer<typeof expenseCategorySchema>
export type ExpenseFormValues = z.infer<typeof expenseSchema>
export type IncomeFormValues = z.infer<typeof incomeSchema>
export type BudgetFormValues = z.infer<typeof budgetSchema>
export type SemesterFormValues = z.infer<typeof semesterSchema>
export type PaymentScheduleFormValues = z.infer<typeof paymentScheduleSchema>
export type SavingsGoalFormValues = z.infer<typeof savingsGoalSchema>
