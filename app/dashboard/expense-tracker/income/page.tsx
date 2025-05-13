"use client"

import { useState } from "react"
import { useGetIncomes } from "@/hooks/expense-tracker/useIncomes"
import { useGetActiveSemester } from "@/hooks/expense-tracker/useSemesters"
import { useCreateIncome, useUpdateIncome, useDeleteIncome } from "@/hooks/expense-tracker/useIncomes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { PiggyBank, Plus, Search, MoreVertical, Trash2, Edit, Calendar } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Income } from "@/types/expense-tracker/expenseTracker.types"

// Income form validation schema
const incomeSchema = z.object({
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
    source: z
        .string()
        .trim()
        .min(1, "Source is required")
        .max(100, "Source cannot exceed 100 characters"),
    isRecurring: z
        .boolean()
        .optional()
        .default(false),
    recurringFrequency: z
        .string()
        .trim()
        .max(50, "Frequency cannot exceed 50 characters")
        .optional()
        .nullable(),
    semesterId: z
        .string()
        .optional()
        .nullable()
})

type IncomeFormValues = z.infer<typeof incomeSchema>

export default function IncomePage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [editingIncome, setEditingIncome] = useState<Income | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null)

    const { data: incomes, isLoading } = useGetIncomes({
        search: searchTerm || undefined,
    })
    const { data: activeSemester } = useGetActiveSemester()

    const { mutate: createIncome, isPending: isCreating } = useCreateIncome()
    const { mutate: updateIncome, isPending: isUpdating } = useUpdateIncome()
    const { mutate: deleteIncome, isPending: isDeleting } = useDeleteIncome()

    const form = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeSchema),
        defaultValues: {
            amount: 0,
            description: "",
            date: new Date().toISOString().split('T')[0],
            source: "",
            isRecurring: false,
            recurringFrequency: "",
            semesterId: activeSemester?.id || null
        }
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const openCreateForm = () => {
        form.reset({
            amount: 0,
            description: "",
            date: new Date().toISOString().split('T')[0],
            source: "",
            isRecurring: false,
            recurringFrequency: "",
            semesterId: activeSemester?.id || null
        })
        setEditingIncome(null)
        setIsFormOpen(true)
    }

    const openEditForm = (income: Income) => {
        form.reset({
            amount: income.amount,
            description: income.description || "",
            date: new Date(income.date).toISOString().split('T')[0],
            source: income.source || "",
            isRecurring: income.isRecurring || false,
            recurringFrequency: income.recurringFrequency || "",
            semesterId: income.semesterId || activeSemester?.id || null
        })
        setEditingIncome(income)
        setIsFormOpen(true)
    }

    const openDeleteDialog = (id: string) => {
        setIncomeToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteIncome = () => {
        if (incomeToDelete) {
            deleteIncome(incomeToDelete, {
                onSuccess: () => {
                    toast.success("Income record deleted successfully")
                    setIsDeleteDialogOpen(false)
                    setIncomeToDelete(null)
                },
                onError: () => {
                    toast.error("Failed to delete income record")
                }
            })
        }
    }

    const onSubmit = (values: IncomeFormValues) => {
        if (editingIncome) {
            updateIncome(
                { id: editingIncome.id, incomeData: values },
                {
                    onSuccess: () => {
                        toast.success("Income record updated successfully")
                        setIsFormOpen(false)
                        form.reset()
                    },
                    onError: () => {
                        toast.error("Failed to update income record")
                    }
                }
            )
        } else {
            createIncome(values, {
                onSuccess: () => {
                    toast.success("Income record created successfully")
                    setIsFormOpen(false)
                    form.reset()
                },
                onError: () => {
                    toast.error("Failed to create income record")
                }
            })
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Income</h1>
                    <p className="text-muted-foreground">
                        Track and manage your sources of income
                    </p>
                </div>
                <Button onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Income
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search income records..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Income History</CardTitle>
                    <CardDescription>
                        View and manage all your recorded income
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {incomes?.data?.incomes?.length ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incomes.data.incomes.map((income) => (
                                    <TableRow key={income.id}>
                                        <TableCell>
                                            {format(new Date(income.date), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {income.source}
                                        </TableCell>
                                        <TableCell>
                                            {income.description || "No description"}
                                        </TableCell>
                                        <TableCell>
                                            {income.isRecurring ? (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                                                    Recurring {income.recurringFrequency ? `(${income.recurringFrequency})` : ''}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">One-time</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                                            {formatCurrency(income.amount)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditForm(income)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => openDeleteDialog(income.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No income records found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You haven't recorded any income yet.
                            </p>
                            <Button onClick={openCreateForm}>
                                <Plus className="mr-2 h-4 w-4" />
                                Record your first income
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Income Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingIncome ? "Edit Income" : "Add New Income"}</DialogTitle>
                        <DialogDescription>
                            {editingIncome
                                ? "Update the details of your income record."
                                : "Fill in the details to add a new income record."}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Job, Scholarship, Gift, etc."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Add more details about this income"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
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

                            <FormField
                                control={form.control}
                                name="isRecurring"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Recurring Income</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Do you receive this income on a regular basis?
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="checkbox"
                                                className="h-4 w-4"
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch("isRecurring") && (
                                <FormField
                                    control={form.control}
                                    name="recurringFrequency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frequency</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="How often do you receive this income?" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                    <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                                    <SelectItem value="semester">Per Semester</SelectItem>
                                                    <SelectItem value="annually">Annually</SelectItem>
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
                                                        <SelectValue placeholder="Link to a semester (optional)" />
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
                                        <>{editingIncome ? "Update" : "Create"} Income</>
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
                        <DialogTitle>Delete Income</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this income record? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteIncome}
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
