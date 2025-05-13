"use client"

import { useState, useCallback } from "react"
import { useGetExpenses } from "@/hooks/expense-tracker/useExpenses"
import { useGetExpenseCategories } from "@/hooks/expense-tracker/useExpenseCategories"
import { useGetActiveSemester } from "@/hooks/expense-tracker/useSemesters"
import { useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/expense-tracker/useExpenses"
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
    DialogTrigger,
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
import { CreditCard, Plus, Search, Filter, MoreVertical, Trash2, Edit, Calendar } from "lucide-react"
import { PaymentMethod } from "@/types/expense-tracker/expenseTracker.types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { expenseSchema } from "@/lib/expense-tracker/validation"
import { z } from "zod"
import { Expense } from "@/types/expense-tracker/expenseTracker.types"

type ExpenseFormValues = z.infer<typeof expenseSchema>

const PAYMENT_METHODS: { value: PaymentMethod, label: string }[] = [
    { value: 'CASH', label: 'Cash' },
    { value: 'CREDIT_CARD', label: 'Credit Card' },
    { value: 'DEBIT_CARD', label: 'Debit Card' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
    { value: 'MOBILE_PAYMENT', label: 'Mobile Payment' },
    { value: 'SCHOLARSHIP', label: 'Scholarship' },
    { value: 'OTHER', label: 'Other' }
]

export default function ExpensesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("")
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)

    const { data: expenses, isLoading } = useGetExpenses({
        search: searchTerm || undefined,
        categoryId: categoryFilter || undefined
    })
    const { data: categories, isLoading: isCategoriesLoading } = useGetExpenseCategories()
    const { data: activeSemester } = useGetActiveSemester()

    const { mutate: createExpense, isPending: isCreating } = useCreateExpense()
    const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense()
    const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense()

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            amount: 0,
            description: "",
            date: new Date().toISOString().split('T')[0],
            categoryId: "",
            paymentMethod: "CASH",
            location: "",
            semesterId: activeSemester?.id || ""
        }
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleCategoryFilterChange = (value: string) => {
        setCategoryFilter(value === "all" ? "" : value)
    }

    const openCreateForm = () => {
        form.reset({
            amount: 0,
            description: "",
            date: new Date().toISOString().split('T')[0],
            categoryId: "",
            paymentMethod: "CASH",
            location: "",
            semesterId: activeSemester?.id || ""
        })
        setEditingExpense(null)
        setIsFormOpen(true)
    }

    const openEditForm = (expense: Expense) => {
        form.reset({
            amount: expense.amount,
            description: expense.description || "",
            date: new Date(expense.date).toISOString().split('T')[0],
            categoryId: expense.categoryId,
            paymentMethod: expense.paymentMethod || "CASH",
            location: expense.location || "",
            semesterId: expense.semesterId || activeSemester?.id || ""
        })
        setEditingExpense(expense)
        setIsFormOpen(true)
    }

    const openDeleteDialog = (id: string) => {
        setExpenseToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteExpense = () => {
        if (expenseToDelete) {
            deleteExpense(expenseToDelete, {
                onSuccess: () => {
                    toast.success("Expense deleted successfully")
                    setIsDeleteDialogOpen(false)
                    setExpenseToDelete(null)
                },
                onError: () => {
                    toast.error("Failed to delete expense")
                }
            })
        }
    }

    const onSubmit = (values: ExpenseFormValues) => {
        if (editingExpense) {
            updateExpense(
                { id: editingExpense.id, expenseData: values },
                {
                    onSuccess: () => {
                        toast.success("Expense updated successfully")
                        setIsFormOpen(false)
                        form.reset()
                    },
                    onError: () => {
                        toast.error("Failed to update expense")
                    }
                }
            )
        } else {
            createExpense(values, {
                onSuccess: () => {
                    toast.success("Expense created successfully")
                    setIsFormOpen(false)
                    form.reset()
                },
                onError: () => {
                    toast.error("Failed to create expense")
                }
            })
        }
    }

    if (isLoading || isCategoriesLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                    <p className="text-muted-foreground">
                        Manage your expenses and track your spending
                    </p>
                </div>
                <Button onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search expenses..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <Select
                    value={categoryFilter ? categoryFilter : "all"}
                    onValueChange={handleCategoryFilterChange}
                >
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <div className="flex items-center">
                            <Filter className="mr-2 h-4 w-4" />
                            <span>{categoryFilter ? "Category Filter" : "All Categories"}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories?.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Expense History</CardTitle>
                    <CardDescription>
                        View and manage all your recorded expenses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {expenses?.data?.expenses?.length ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.data.expenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>
                                            {format(new Date(expense.date), "MMM d, yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            {expense.description || "No description"}
                                            {expense.location && (
                                                <div className="text-xs text-muted-foreground">
                                                    {expense.location}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {expense.category ? (
                                                <Badge variant="outline" style={{
                                                    backgroundColor: expense.category.color ? `${expense.category.color}20` : undefined,
                                                    color: expense.category.color || undefined,
                                                    borderColor: expense.category.color || undefined
                                                }}>
                                                    {expense.category.name}
                                                </Badge>
                                            ) : "Uncategorized"}
                                        </TableCell>
                                        <TableCell>
                                            {expense.paymentMethod ?
                                                PAYMENT_METHODS.find(m => m.value === expense.paymentMethod)?.label ||
                                                expense.paymentMethod : "Not specified"}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-destructive">
                                            {formatCurrency(expense.amount)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditForm(expense)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => openDeleteDialog(expense.id)}
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
                            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No expenses found</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                You haven't recorded any expenses yet.
                            </p>
                            <Button onClick={openCreateForm}>
                                <Plus className="mr-2 h-4 w-4" />
                                Record your first expense
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Expense Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
                        <DialogDescription>
                            {editingExpense
                                ? "Update the details of your expense record."
                                : "Fill in the details to add a new expense record."}
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Describe the expense"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories?.map(category => (
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
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || undefined}
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

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location (Optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Where was the purchase made?"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {activeSemester && (
                                <FormField
                                    control={form.control}
                                    name="semesterId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Semester</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || undefined}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a semester" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
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
                                        <>{editingExpense ? "Update" : "Create"} Expense</>
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
                        <DialogTitle>Delete Expense</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this expense? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteExpense}
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
