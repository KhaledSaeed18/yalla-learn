"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    useGetSemester,
    useUpdateSemester
} from '@/hooks/expense-tracker/useSemesters';
import {
    UpdateSemesterRequest,
    Term
} from '@/types/expense-tracker/expenseTracker.types';
import { format } from 'date-fns';
import {
    Loader2,
    ArrowLeft,
    Calendar,
    Save,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    AlertTitle
} from '@/components/ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CheckCircle } from 'lucide-react';

interface SemesterEditPageProps {
    params: {
        id: string;
    };
}

// Schema for form validation
const formSchema = z.object({
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

const SemesterEditPage = ({ params }: SemesterEditPageProps) => {
    const router = useRouter();
    const semesterId = params.id;

    const { data: semester, isLoading } = useGetSemester(semesterId);
    const { mutate: updateSemester, isPending: isUpdating, isSuccess } = useUpdateSemester();

    // Form setup
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            term: 'FALL' as Term,
            year: new Date().getFullYear(),
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
            isActive: false,
        },
    });

    // Initialize form with semester data when it loads
    useEffect(() => {
        if (semester) {
            form.reset({
                name: semester.name,
                term: semester.term,
                year: semester.year,
                startDate: new Date(semester.startDate),
                endDate: new Date(semester.endDate),
                isActive: semester.isActive,
            });
        }
    }, [semester, form]);

    // Handle update form submission
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const updateData: UpdateSemesterRequest = {
            name: values.name,
            term: values.term,
            year: values.year,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            isActive: values.isActive,
        };

        updateSemester(
            { id: semesterId, semesterData: updateData },
            {
                onSuccess: () => {
                    // Wait a moment for the success state to be shown before redirecting
                    setTimeout(() => {
                        router.push(`/dashboard/expense-tracker/semesters/${semesterId}`);
                    }, 1500);
                }
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!semester) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                    <h2 className="text-2xl font-bold">Semester Not Found</h2>
                    <p className="text-muted-foreground">
                        The semester you're looking for doesn't exist or has been removed.
                    </p>
                    <Button onClick={() => router.push('/dashboard/expense-tracker/semesters')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Semesters
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/expense-tracker/semesters/${semesterId}`)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">Edit Semester: {semester.name}</h1>
            </div>

            {isSuccess && (
                <Alert className="bg-green-500/10 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        The semester has been updated successfully.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Edit Semester Details</CardTitle>
                    <CardDescription>Update the information for this semester</CardDescription>
                </CardHeader>
                <CardContent>
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

                            {semester.isActive && !form.getValues('isActive') && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Warning</AlertTitle>
                                    <AlertDescription>
                                        You are about to deactivate the currently active semester. Make sure to set another semester as active.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <CardFooter className="flex justify-end gap-2 px-0">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push(`/dashboard/expense-tracker/semesters/${semesterId}`)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SemesterEditPage;
