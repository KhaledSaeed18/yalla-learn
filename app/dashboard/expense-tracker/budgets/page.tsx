"use client"

import { useState } from "react"
import { useGetBudgets } from "@/hooks/expense-tracker/useBudgets"
import { useGetExpenseCategories } from "@/hooks/expense-tracker/useExpenseCategories"
import { useGetActiveSemester } from "@/hooks/expense-tracker/useSemesters"
import { useCreateBudget, useUpdateBudget, useDeleteBudget } from "@/hooks/expense-tracker/useBudgets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import LoadingSpinner from "@/components/shared/LoadingSpinner"
import { Calendar, MoreVertical, Plus, Target, Trash2, Edit } from "lucide-react"
import { BudgetPeriod } from "@/types/expense-tracker/expenseTracker.types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Budget } from "@/types/expense-tracker/expenseTracker.types"

// Budget form validation schema
const budgetSchema = z.object({
    name: z.string().min(1, "Budget name is required").max(50, "Budget name cannot exceed 50 characters"),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    period: z.enum(["DAILY", "WEEKLY", "MONTHLY", "SEMESTER", "YEARLY"] as const),
    categoryId: z.string().min(1, "Category is required"),
    semesterId: z.string().optional().nullable(),
    description: z.string().max(255, "Description cannot exceed 255 characters").optional().nullable(),
})

type BudgetFormValues = z.infer<typeof budgetSchema>

const BUDGET_PERIODS: { value: BudgetPeriod, label: string }[] = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'SEMESTER', label: 'Semester' },
    { value: 'YEARLY', label: 'Yearly' }
]

export default function BudgetsPage() {
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null)

    const { data: budgets, isLoading } = useGetBudgets()
    const { data: categories, isLoading: isCategoriesLoading } = useGetExpenseCategories()
    const { data: activeSemester } = useGetActiveSemester()

    const { mutate: createBudget, isPending: isCreating } = useCreateBudget()
    const { mutate: updateBudget, isPending: isUpdating } = useUpdateBudget()
    const { mutate: deleteBudget, isPending: isDeleting } = useDeleteBudget()

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            name: "",
            amount: 0,
            period: "MONTHLY",
            categoryId: "",
            semesterId: activeSemester?.id || null,
            description: ""
        }
    })

    const openCreateForm = () => {
        form.reset({
            name: "",
            amount: 0,
            period: "MONTHLY",
            categoryId: "",
            semesterId: activeSemester?.id || null,
            description: ""
        })
        setEditingBudget(null)
        setIsFormOpen(true)
    }

    const openEditForm = (budget: Budget) => {
        form.reset({
            name: budget.name,
            amount: budget.amount,
            period: budget.period,
            categoryId: budget.categoryId,
            semesterId: budget.semesterId || null,
            description: budget.description || ""
        })
        setEditingBudget(budget)
        setIsFormOpen(true)
    }

    const openDeleteDialog = (id: string) => {
        setBudgetToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleDeleteBudget = () => {
        if (budgetToDelete) {
            deleteBudget(budgetToDelete, {
                onSuccess: () => {
                    toast.success("Budget deleted successfully")
                    setIsDeleteDialogOpen(false)
                    setBudgetToDelete(null)
                },
                onError: () => {
                    toast.error("Failed to delete budget")
                }
            })
        }
    }

    const onSubmit = (values: BudgetFormValues) => {
        if (editingBudget) {
            updateBudget(
                { id: editingBudget.id, budgetData: values },
                {
                    onSuccess: () => {
                        toast.success("Budget updated successfully")
                        setIsFormOpen(false)
                        form.reset()
                    },
                    onError: () => {
                        toast.error("Failed to update budget")
                    }
                }
            )
        } else {
            createBudget(values, {
                onSuccess: () => {
                    toast.success("Budget created successfully")
                    setIsFormOpen(false)
                    form.reset()
                },
                onError: () => {
                    toast.error("Failed to create budget")
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
                    <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
                    <p className="text-muted-foreground">
                        Create and manage budgets to keep your expenses in check
                    </p>
                </div>
                <Button onClick={openCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Budget
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets?.length ? (
                    budgets.map((budget) => {
                        const category = categories?.find(c => c.id === budget.categoryId)
                        return (
                            <Card key={budget.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{budget.name}</CardTitle>
                                            <CardDescription>
                                                {BUDGET_PERIODS.find(p => p.value === budget.period)?.label || budget.period} Budget
                                            </CardDescription>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditForm(budget)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => openDeleteDialog(budget.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Category</p>
                                        {category ? (
                                            <Badge variant="outline" style={{
                                                backgroundColor: category.color ? `${category.color}20` : undefined,
                                                color: category.color || undefined,
                                                borderColor: category.color || undefined
                                            }}>
                                                {category.name}
                                            </Badge>
                                        ) : "Uncategorized"}
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Budget Amount</p>
                                        <p className="text-2xl font-bold">{formatCurrency(budget.amount)}</p>
                                    </div>

                                    {budget.description && (
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-muted-foreground">Description</p>
                                            <p className="text-sm">{budget.description}</p>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    {budget.semesterId && activeSemester && budget.semesterId === activeSemester.id && (
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            <span>Active for current semester</span>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        )
                    })
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <Target className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No budgets found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            You haven't created any budgets yet.
                        </p>
                        <Button onClick={openCreateForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create your first budget
                        </Button>
                    </div>
                )}
            </div>

            {/* Budget Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingBudget ? "Edit Budget" : "Create New Budget"}</DialogTitle>
                        <DialogDescription>
                            {editingBudget
                                ? "Update the details of your budget."
                                : "Set up a new budget to help track your spending."}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Budget Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., Food Budget, Entertainment, etc."
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
                                            <FormLabel>Budget Amount</FormLabel>
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
                                    name="period"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Budget Period</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select period" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {BUDGET_PERIODS.map(period => (
                                                        <SelectItem key={period.value} value={period.value}>
                                                            {period.label}
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

                            {activeSemester && (
                                <FormField
                                    control={form.control}
                                    name="semesterId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Semester (Optional)</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value || undefined}
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

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Provide more details about this budget"
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
                                        <>{editingBudget ? "Update" : "Create"} Budget</>
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
                        <DialogTitle>Delete Budget</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this budget? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteBudget}
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
