"use client"

import { useState } from "react"
import { useGetPaymentSchedules } from "@/hooks/expense-tracker/usePaymentSchedules"
import { useGetExpenseCategories } from "@/hooks/expense-tracker/useExpenseCategories"
import { useGetActiveSemester } from "@/hooks/expense-tracker/useSemesters"
import {
    useCreatePaymentSchedule,
    useUpdatePaymentSchedule,
    useDeletePaymentSchedule
} from "@/hooks/expense-tracker/usePaymentSchedules"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { toast } from "sonner"
import { format, addDays } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Clock, Plus, MoreVertical, Trash2, Edit, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import { PaymentMethod, UniversityPaymentType } from "@/types/expense-tracker/expenseTracker.types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

// Payment Schedule form validation schema
const paymentScheduleSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    paymentMethod: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "MOBILE_PAYMENT", "SCHOLARSHIP", "OTHER"] as const).optional(),
    categoryId: z.string().optional(),
    description: z.string().max(255, "Description cannot exceed 255 characters").optional().nullable(),
    isPaid: z.boolean().default(false),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.number().min(1, "Interval must be at least 1").optional(),
    recurringUnit: z.enum(["days", "weeks", "months"] as const).optional(),
    paymentType: z.enum(["TUITION", "HOUSING", "MEAL_PLAN", "BOOKS", "LAB_FEES", "ACTIVITY_FEES", "TECHNOLOGY_FEES", "INSURANCE", "PARKING", "OTHER"] as const).optional(),
    semesterId: z.string().optional().nullable(),
})

type PaymentScheduleFormValues = z.infer<typeof paymentScheduleSchema>

const PAYMENT_METHODS: { value: PaymentMethod, label: string }[] = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'MOBILE_PAYMENT', label: 'Mobile Payment' },
    { value: 'SCHOLARSHIP', label: 'Scholarship' },
    { value: 'OTHER', label: 'Other' }
]

const PAYMENT_TYPES: { value: UniversityPaymentType, label: string }[] = [
    { value: 'TUITION', label: 'Tuition' },
    { value: 'HOUSING', label: 'Housing' },
    { value: 'MEAL_PLAN', label: 'Meal Plan' },
    { value: 'BOOKS', label: 'Books' },
    { value: 'LAB_FEES', label: 'Lab Fees' },
    { value: 'ACTIVITY_FEES', label: 'Activity Fees' },
    { value: 'TECHNOLOGY_FEES', label: 'Technology Fees' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'PARKING', label: 'Parking' },
    { value: 'OTHER', label: 'Other' }
]

export default function PaymentSchedulesPage() {
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null)

    const { data: schedules, isLoading } = useGetPaymentSchedules()
    const { data: categories, isLoading: isCategoriesLoading } = useGetExpenseCategories()
    const { data: activeSemester } = useGetActiveSemester()

    const { mutate: createSchedule, isPending: isCreating } = useCreatePaymentSchedule()
    const { mutate: updateSchedule, isPending: isUpdating } = useUpdatePaymentSchedule()
    const { mutate: deleteSchedule, isPending: isDeleting } = useDeletePaymentSchedule()

    const form = useForm<PaymentScheduleFormValues>({
        resolver: zodResolver(paymentScheduleSchema),
        defaultValues: {
            name: "",
            amount: 0,
            dueDate: new Date().toISOString().split('T')[0],
            paymentMethod: "BANK_TRANSFER",
            categoryId: "",
            description: "",
            isPaid: false,
            isRecurring: false,
            recurringInterval: 1,
            recurringUnit: "months",
            paymentType: "TUITION",
            semesterId: activeSemester?.id || null
        }
    })

    const isRecurring = form.watch("isRecurring")

    const openCreateForm = () => {
        form.reset({
            name: "",
            amount: 0,
            dueDate: new Date().toISOString().split('T')[0],
            paymentMethod: "BANK_TRANSFER",
            categoryId: "",
            description: "",
            isPaid: false,
            isRecurring: false,
            recurringInterval: 1,
            recurringUnit: "months",
            paymentType: "TUITION",
            semesterId: activeSemester?.id || null
        })
        setEditingScheduleId(null)
        setIsFormOpen(true)
    }

    const openEditForm = (schedule: any) => {
        form.reset({
            name: schedule.name,
            amount: schedule.amount,
            dueDate: new Date(schedule.dueDate).toISOString().split('T')[0],
            paymentMethod: schedule.paymentMethod || "BANK_TRANSFER",
            categoryId: schedule.categoryId || "",
            description: schedule.description || "",
            isPaid: schedule.isPaid || false,
            isRecurring: schedule.isRecurring || false,
            recurringInterval: schedule.recurringInterval || 1,
            recurringUnit: schedule.recurringUnit || "months",
            paymentType: schedule.paymentType || "TUITION",
            semesterId: schedule.semesterId || activeSemester?.id || null
        })
        setEditingScheduleId(schedule.id)
        setIsFormOpen(true)
    }

    const openDeleteDialog = (id: string) => {
        setScheduleToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteSchedule = () => {
        if (scheduleToDelete) {
            deleteSchedule(scheduleToDelete, {
                onSuccess: () => {
                    toast.success("Payment schedule deleted successfully")
                    setIsDeleteDialogOpen(false)
                    setScheduleToDelete(null)
                },
                onError: () => {
                    toast.error("Failed to delete payment schedule")
                }
            })
        }
    }

    const onSubmit = (values: PaymentScheduleFormValues) => {
        if (editingScheduleId) {
            updateSchedule(
                { id: editingScheduleId, paymentScheduleData: values },
                {
                    onSuccess: () => {
                        toast.success("Payment schedule updated successfully")
                        setIsFormOpen(false)
                        form.reset()
                    },
                    onError: () => {
                        toast.error("Failed to update payment schedule")
                    }
                }
            )
        } else {
            createSchedule(values, {
                onSuccess: () => {
                    toast.success("Payment schedule created successfully")
                    setIsFormOpen(false)
                    form.reset()
                },
                onError: () => {
                    toast.error("Failed to create payment schedule")
                }
            })
        }
    }

    if (isLoading || isCategoriesLoading) {
        return <LoadingSpinner />
    }

    // Check if we have any upcoming payments
    const today = new Date();
    const upcomingPayments = schedules?.data?.paymentSchedules?.filter(
        schedule => !schedule.isPaid && new Date(schedule.dueDate) > today
    ) || [];

    const sortedPayments = [...(schedules?.data?.paymentSchedules || [])].sort((a, b) => {
        // First sort by isPaid (unpaid first)
        if (a.isPaid !== b.isPaid) {
            return a.isPaid ? 1 : -1;
        }
        // Then sort by due date (upcoming first)
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payment Schedules</h1>
                    <p className="text-muted-foreground">
                        Keep track of upcoming tuition and university payments
                    </p>
                </div>
                <Button onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment
                </Button>
            </div>

            {upcomingPayments.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-blue-700 dark:text-blue-400">Upcoming Payments</h3>
                                <p className="text-sm text-blue-600 dark:text-blue-500 mb-2">
                                    You have {upcomingPayments.length} upcoming {upcomingPayments.length === 1 ? 'payment' : 'payments'}
                                </p>
                                <div className="space-y-2">
                                    {upcomingPayments.slice(0, 2).map(payment => (
                                        <div key={payment.id} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                            <div>
                                                <span className="font-medium">{payment.name}</span>
                                                <div className="text-blue-600 dark:text-blue-400">
                                                    Due: {format(new Date(payment.dueDate), "MMM d, yyyy")}
                                                </div>
                                            </div>
                                            <span className="font-medium">{formatCurrency(payment.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Payment Schedule</CardTitle>
                    <CardDescription>
                        Manage your upcoming tuition and fee payments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedPayments.length ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedPayments.map((payment) => {
                                    const isPastDue = !payment.isPaid && new Date(payment.dueDate) < today;
                                    const isUpcoming = !payment.isPaid && new Date(payment.dueDate) >= today;

                                    return (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-medium">
                                                {payment.name}
                                                {payment.isRecurring && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Recurring every {payment.recurringInterval} {payment.recurringUnit}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className={isPastDue ? "text-destructive font-medium" : ""}>
                                                    {format(new Date(payment.dueDate), "MMM d, yyyy")}
                                                </div>
                                                {isPastDue && (
                                                    <div className="text-xs text-destructive">
                                                        Past due
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {payment.paymentType && (
                                                    <Badge variant="outline">
                                                        {PAYMENT_TYPES.find(t => t.value === payment.paymentType)?.label || payment.paymentType}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {payment.isPaid ? (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Paid
                                                    </Badge>
                                                ) : isPastDue ? (
                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
                                                        Overdue
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditForm(payment)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => openDeleteDialog(payment.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No payment schedules found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You haven't created any payment schedules yet.
                            </p>
                            <Button onClick={openCreateForm}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add your first payment
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingScheduleId ? "Edit Payment" : "Add New Payment"}</DialogTitle>
                        <DialogDescription>
                            {editingScheduleId
                                ? "Update the details of your scheduled payment."
                                : "Schedule a new tuition or university payment."}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Fall Semester Tuition, Housing Deposit, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    {...field}
                                                    value={field.value || ''}
                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Due Date</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="date"
                                                        className="pl-8"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                    {PAYMENT_TYPES.map(type => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment method" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PAYMENT_METHODS.map(method => (
                                                        <SelectItem key={method.value} value={method.value}>
                                                            {method.label}
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
                                name="isPaid"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Payment Status</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Mark if this payment has already been paid
                                            </p>
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

                            <FormField
                                control={form.control}
                                name="isRecurring"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Recurring Payment</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Set if this payment repeats on a schedule
                                            </p>
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

                            {isRecurring && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="recurringInterval"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Interval</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="365"
                                                        {...field}
                                                        value={field.value || ''}
                                                        onChange={e => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="recurringUnit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unit</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select time unit" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="days">Days</SelectItem>
                                                        <SelectItem value="weeks">Weeks</SelectItem>
                                                        <SelectItem value="months">Months</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}

                            {categories && (
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expense Category (Optional)</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Link to an expense category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    {categories.map(category => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {activeSemester && (
                                <FormField
                                    control={form.control}
                                    name="semesterId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Semester (Optional)</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Link to a semester" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    <SelectItem value={activeSemester.id}>
                                                        {activeSemester.name}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Add any additional details"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                >
                                    {isCreating || isUpdating ? (
                                        <>Saving...</>
                                    ) : (
                                        <>{editingScheduleId ? "Update" : "Schedule"} Payment</>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Payment Schedule</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this payment schedule? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteSchedule}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
