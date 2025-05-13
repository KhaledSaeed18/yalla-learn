"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpenseCard } from '@/components/expense-tracker/ExpenseCard';
import { ExpenseForm, ExpenseFormValues } from '@/components/expense-tracker/ExpenseForm';
import { DeleteExpenseDialog } from '@/components/expense-tracker/DeleteExpenseDialog';
import { ExpensesGridSkeleton } from '@/components/expense-tracker/skeletons/ExpenseSkeleton';
import { useGetExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '@/hooks/expense-tracker/useExpenses';
import { useGetSemesters, useGetActiveSemester } from '@/hooks/expense-tracker/useSemesters';
import { ExpensesQueryParams, Expense, ExpenseCategoryType, PaymentMethod } from '@/types/expense-tracker/expenseTracker.types';

const ExpensesPage = () => {
    const [filters, setFilters] = useState<ExpensesQueryParams>({
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch data using custom hooks
    const { data: activeSemester } = useGetActiveSemester();
    const { data: semesters, isLoading: isLoadingSemesters } = useGetSemesters();
    const { data: expensesData, isLoading: isLoadingExpenses } = useGetExpenses(filters);

    // Mutation hooks
    const { mutate: createExpense, isPending: isCreating } = useCreateExpense();
    const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();
    const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

    // Set active semester as default filter when it loads
    useEffect(() => {
        if (activeSemester && !filters.semesterId) {
            setFilters(prev => ({
                ...prev,
                semesterId: activeSemester.id
            }));
        }
    }, [activeSemester, filters.semesterId]);

    // Handle search input with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== undefined) {
                setFilters(prev => ({
                    ...prev,
                    search: searchQuery,
                    page: 1 // Reset to first page on new search
                }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Form handlers
    const handleCreateExpense = (data: ExpenseFormValues) => {
        createExpense({
            ...data,
            date: format(data.date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
            paymentMethod: data.paymentMethod as PaymentMethod,
            location: data.location || '' // Ensure location is always a string
        }, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
            }
        });
    };

    const handleUpdateExpense = (data: ExpenseFormValues) => {
        if (selectedExpense) {
            updateExpense({
                id: selectedExpense.id,
                expenseData: {
                    ...data,
                    date: format(data.date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
                    paymentMethod: data.paymentMethod as PaymentMethod
                }
            }, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedExpense(null);
                }
            });
        }
    };

    const handleDeleteExpense = () => {
        if (selectedExpense) {
            deleteExpense(selectedExpense.id, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedExpense(null);
                }
            });
        }
    };

    // Prepare default values for create form
    const getCreateFormDefaultValues = (): ExpenseFormValues => {
        return {
            description: '',
            amount: 0,
            date: new Date(),
            category: ExpenseCategoryType.OTHER,
            paymentMethod: 'CASH' as PaymentMethod,
            location: '',
            semesterId: activeSemester?.id || ''
        };
    };

    // Prepare default values for edit form
    const getEditFormDefaultValues = (): ExpenseFormValues => {
        if (!selectedExpense) return getCreateFormDefaultValues();

        return {
            description: selectedExpense.description,
            amount: parseFloat(selectedExpense.amount),
            date: new Date(selectedExpense.date),
            category: selectedExpense.category as ExpenseCategoryType,
            paymentMethod: selectedExpense.paymentMethod as PaymentMethod,
            location: selectedExpense.location || '',
            semesterId: selectedExpense.semesterId
        };
    };

    if (isLoadingSemesters || (isLoadingExpenses && !expensesData)) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Expenses</h1>
                        <p className="text-muted-foreground">
                            Manage and track your expenses
                        </p>
                    </div>
                    <Button disabled>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                    </Button>
                </div>

                {/* Filters and Search Skeleton */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select disabled>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Semester" />
                            </SelectTrigger>
                        </Select>
                    </div>
                </div>

                {/* Expenses Grid Skeleton */}
                <ExpensesGridSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Expenses</h1>
                    <p className="text-muted-foreground">
                        Manage and track your expenses
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="flex gap-1 items-center">
                    <Plus className="h-4 w-4" />
                    Add Expense
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Semester filter */}
                    <Select
                        value={filters.semesterId || ''}
                        onValueChange={(value) => {
                            setFilters({ ...filters, semesterId: value, page: 1 });
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            {semesters?.map((semester) => (
                                <SelectItem key={semester.id} value={semester.id}>
                                    {semester.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Expense filters
                <ExpenseFilters
                    filters={filters}
                    onFilterChange={applyFilters}
                    onResetFilters={resetFilters}
                /> */}
            </div>

            {/* Expenses Grid */}
            {expensesData?.expenses && expensesData.expenses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {expensesData.expenses.map((expense) => (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            onEdit={(expense) => {
                                setSelectedExpense(expense);
                                setIsEditDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                const expense = expensesData.expenses.find(e => e.id === id);
                                if (expense) {
                                    setSelectedExpense(expense);
                                    setIsDeleteDialogOpen(true);
                                }
                            }}
                        />
                    ))}
                </div>
            ) : (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No expenses found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            {filters.search || Object.keys(filters).length > 3 ?
                                'Try changing your filters or search query' :
                                'Start by adding your first expense'}
                        </p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            Add Expense
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Create Expense Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                    </DialogHeader>
                    <ExpenseForm
                        defaultValues={getCreateFormDefaultValues()}
                        onSubmit={handleCreateExpense}
                        isSubmitting={isCreating}
                        submitButtonText="Create Expense"
                        onCancel={() => setIsCreateDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Expense Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                    </DialogHeader>
                    <ExpenseForm
                        defaultValues={getEditFormDefaultValues()}
                        onSubmit={handleUpdateExpense}
                        isSubmitting={isUpdating}
                        submitButtonText="Update Expense"
                        onCancel={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteExpenseDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteExpense}
                isDeleting={isDeleting}
                expense={selectedExpense}
            />
        </div>
    );
};

export default ExpensesPage;