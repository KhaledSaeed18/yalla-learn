import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form schema for validation
export const incomeFormSchema = z.object({
    amount: z.coerce.number().positive({
        message: "Amount must be a positive number.",
    }),
    source: z.string().min(3, {
        message: "Source must be at least 3 characters.",
    }),
    description: z.string().optional(),
    date: z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
            return undefined;
        },
        z.date({
            required_error: "Please select a date",
            invalid_type_error: "That's not a valid date",
        })
    ),
    recurring: z.boolean().default(false),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;

interface IncomeFormProps {
    defaultValues: IncomeFormValues;
    onSubmit: (values: IncomeFormValues) => void;
    isSubmitting: boolean;
    submitButtonText: string;
    cancelButtonText?: string;
    onCancel?: () => void;
}

export const IncomeForm = ({
    defaultValues,
    onSubmit,
    isSubmitting,
    submitButtonText,
    cancelButtonText = "Cancel",
    onCancel,
}: IncomeFormProps) => {
    const form = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeFormSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Source</FormLabel>
                                <FormControl>
                                    <Input placeholder="E.g., Part-time Job, Scholarship" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Provide additional details about this income" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="recurring"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Recurring Income</FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            {cancelButtonText}
                        </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
