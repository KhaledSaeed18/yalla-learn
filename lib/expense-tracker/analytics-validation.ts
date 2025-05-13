import { z } from 'zod';

// Validation schema for expense summary parameters
export const expenseSummaryParamsSchema = z.object({
    startDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid start date format",
        }),
    endDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid end date format",
        }),
    semesterId: z
        .string()
        .optional()
});

// Validation schema for expense-income comparison parameters
export const expenseIncomeComparisonParamsSchema = z.object({
    startDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid start date format",
        }),
    endDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid end date format",
        }),
    groupBy: z
        .enum(['day', 'week', 'month', 'year'])
        .optional(),
    semesterId: z
        .string()
        .optional()
});

// Validation schema for dashboard statistics parameters
export const dashboardStatsParamsSchema = z.object({
    period: z
        .enum(['this-month', 'last-month', 'this-year', 'last-year', 'all-time', 'custom']),
    startDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid start date format",
        }),
    endDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid end date format",
        }),
    semesterId: z
        .string()
        .optional()
})
    .refine(
        (data) => {
            if (data.period === 'custom') {
                return !!data.startDate && !!data.endDate;
            }
            return true;
        },
        {
            message: "Start date and end date are required when period is 'custom'",
            path: ['startDate', 'endDate']
        }
    );
