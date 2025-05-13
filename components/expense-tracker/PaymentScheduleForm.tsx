import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useGetSemesters } from '@/hooks/expense-tracker/useSemesters';
import { PaymentType } from '@/types/expense-tracker/expenseTracker.types';

// Schema for form validation
export const paymentScheduleFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    amount: z.coerce.number().positive({
        message: "Amount must be a positive number.",
    }),
    dueDate: z.date({
        required_error: "Due date is required.",
    }),
    isPaid: z.boolean().default(false),
    paidDate: z.date().nullable().optional(),
    semesterId: z.string().min(1, {
        message: "Please select a valid semester.",
    }),
    paymentType: z.enum([
        'TUITION',
        'HOUSING',
        'MEAL_PLAN',
        'BOOKS',
        'LAB_FEES',
        'ACTIVITY_FEES',
        'TECHNOLOGY_FEES',
        'INSURANCE',
        'PARKING',
        'OTHER'
    ]),
    notes: z.string().optional(),
}).refine(data => {
    // If isPaid is true and paidDate is null, it's invalid
    return !data.isPaid || data.paidDate !== null;
}, {
    message: "Paid date is required when marked as paid",
    path: ["paidDate"],
});

export type PaymentScheduleFormValues = z.infer<typeof paymentScheduleFormSchema>;

interface PaymentScheduleFormProps {
    defaultValues: PaymentScheduleFormValues;
    onSubmit: (values: PaymentScheduleFormValues) => void;
    isSubmitting: boolean;
    submitButtonText: string;
    cancelButtonText?: string;
    onCancel?: () => void;
}

export const PaymentScheduleForm = ({
    defaultValues,
    onSubmit,
    isSubmitting,
    submitButtonText,
    cancelButtonText = "Cancel",
    onCancel,
}: PaymentScheduleFormProps) => {
    const form = useForm<PaymentScheduleFormValues>({
        resolver: zodResolver(paymentScheduleFormSchema),
        defaultValues,
    });

    const { data: semesters, isLoading: isLoadingSemesters } = useGetSemesters();
    const [prevIsPaid, setPrevIsPaid] = useState(defaultValues.isPaid);

    // Payment types array
    const paymentTypes: PaymentType[] = [
        'TUITION',
        'HOUSING',
        'MEAL_PLAN',
        'BOOKS',
        'LAB_FEES',
        'ACTIVITY_FEES',
        'TECHNOLOGY_FEES',
        'INSURANCE',
        'PARKING',
        'OTHER'
    ];

    // Handle isPaid change to auto-set paidDate
    const handleIsPaidChange = (isPaid: boolean) => {
        const currentPaidDate = form.getValues('paidDate');

        // If changing from unpaid to paid and no paid date is set, set it to today
        if (isPaid && !prevIsPaid && !currentPaidDate) {
            form.setValue('paidDate', new Date());
        }

        setPrevIsPaid(isPaid);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 overflow-hidden">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Spring Tuition" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paymentType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {paymentTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace('_', ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Due Date</FormLabel>
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
                        name="semesterId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Semester</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isLoadingSemesters}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select semester" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {semesters?.map((semester) => (
                                            <SelectItem key={semester.id} value={semester.id}>
                                                {semester.name} ({semester.term} {semester.year})
                                                {semester.isActive && " - Active"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="isPaid"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <FormLabel>Payment Status</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            handleIsPaidChange(checked);
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="paidDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Payment Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={!form.getValues('isPaid')}
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
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={!form.getValues('isPaid')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Additional information about this payment..."
                                    className="resize-none"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4 pt-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            {cancelButtonText}
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
