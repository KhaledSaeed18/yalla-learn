import React from 'react';
import { format } from 'date-fns';
import { Calendar, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Term } from '@/types/expense-tracker/expenseTracker.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Schema for form validation
export const semesterFormSchema = z.object({
    name: z.string().min(2, {
        message: "Semester name must be at least 2 characters.",
    }),
    term: z.enum(['FALL', 'SPRING', 'SUMMER']),
    year: z.coerce.number().min(2020).max(2030),
    startDate: z.date(),
    endDate: z.date(),
    isActive: z.boolean().default(false),
}).refine((data) => {
    return data.startDate < data.endDate;
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});

export type SemesterFormValues = z.infer<typeof semesterFormSchema>;

interface SemesterFormProps {
    defaultValues: SemesterFormValues;
    onSubmit: (values: SemesterFormValues) => void;
    isSubmitting: boolean;
    submitButtonText: string;
    cancelButtonText?: string;
    onCancel?: () => void;
    showActiveWarning?: boolean;
}

export const SemesterForm = ({
    defaultValues,
    onSubmit,
    isSubmitting,
    submitButtonText,
    cancelButtonText = "Cancel",
    onCancel,
    showActiveWarning = false,
}: SemesterFormProps) => {
    const form = useForm<SemesterFormValues>({
        resolver: zodResolver(semesterFormSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Semester Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Fall 2023" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="term"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Term</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a term" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="FALL">Fall</SelectItem>
                                        <SelectItem value="SPRING">Spring</SelectItem>
                                        <SelectItem value="SUMMER">Summer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Year"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
                                <div className="space-y-1">
                                    <FormLabel>Set as Active Semester</FormLabel>
                                    <FormDescription>
                                        Active semester will be used as default for new expenses
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"
                                                    }`}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
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
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"
                                                    }`}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
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
                </div>

                {showActiveWarning && defaultValues.isActive && !form.getValues('isActive') && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            You are about to deactivate the currently active semester. Make sure to set another semester as active.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            {cancelButtonText}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
