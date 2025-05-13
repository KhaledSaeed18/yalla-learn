"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, PiggyBank } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IncomeCard } from '@/components/expense-tracker/IncomeCard';
import { IncomeForm, IncomeFormValues } from '@/components/expense-tracker/IncomeForm';
import { DeleteIncomeDialog } from '@/components/expense-tracker/DeleteIncomeDialog';

import { useGetIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } from '@/hooks/expense-tracker/useIncome';
import { Income, IncomeQueryParams } from '@/types/expense-tracker/income.types';

const IncomePage = () => {
    const router = useRouter();
    const [filters, setFilters] = useState<IncomeQueryParams>({
        page: 1,
        limit: 9,
        sortBy: 'date',
        sortOrder: 'desc'
    });

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

    // Fetch data using custom hooks
    const { data: incomesData, isLoading: isLoadingIncomes } = useGetIncomes(filters);

    // Mutation hooks
    const { mutate: createIncome, isPending: isCreating } = useCreateIncome();
    const { mutate: updateIncome, isPending: isUpdating } = useUpdateIncome();
    const { mutate: deleteIncome, isPending: isDeleting } = useDeleteIncome();


    // Form handlers
    const handleCreateIncome = (data: IncomeFormValues) => {
        createIncome({
            amount: data.amount,
            source: data.source,
            description: data.description || null,
            date: format(data.date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
            recurring: data.recurring
        }, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
            }
        });
    };

    const handleUpdateIncome = (data: IncomeFormValues) => {
        if (selectedIncome) {
            updateIncome({
                id: selectedIncome.id,
                incomeData: {
                    amount: data.amount,
                    source: data.source,
                    description: data.description || null,
                    date: format(data.date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
                    recurring: data.recurring
                }
            }, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedIncome(null);
                }
            });
        }
    };

    const handleDeleteIncome = () => {
        if (selectedIncome) {
            deleteIncome(selectedIncome.id, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedIncome(null);
                }
            });
        }
    };

    // Pagination handlers
    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Prepare default values for create form
    const getCreateFormDefaultValues = (): IncomeFormValues => {
        return {
            amount: 0,
            source: '',
            description: '',
            date: new Date(),
            recurring: false
        };
    };

    // Prepare default values for edit form
    const getEditFormDefaultValues = (): IncomeFormValues => {
        if (!selectedIncome) return getCreateFormDefaultValues();

        return {
            amount: selectedIncome.amount,
            source: selectedIncome.source,
            description: selectedIncome.description || '',
            date: new Date(selectedIncome.date),
            recurring: selectedIncome.recurring
        };
    };

    if (isLoadingIncomes && !incomesData) {
        return (
            <div className="">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Income</h1>
                    <Skeleton className="h-10 w-24" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <Skeleton key={index} className="h-48" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
                <h1 className="text-3xl font-bold">Income</h1>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Income
                </Button>
            </div>

            {incomesData?.incomes?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <PiggyBank className="h-12 w-12 mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No income records found</h3>
                    <p className="text-muted-foreground mt-1">
                        Start tracking your income by adding your first income record.
                    </p>
                    <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Income
                    </Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {incomesData?.incomes.map((income) => (
                            <IncomeCard
                                key={income.id}
                                income={income}
                                onEdit={(income) => {
                                    setSelectedIncome(income);
                                    setIsEditDialogOpen(true);
                                }}
                                onDelete={(id) => {
                                    const income = incomesData?.incomes.find((i) => i.id === id);
                                    if (income) {
                                        setSelectedIncome(income);
                                        setIsDeleteDialogOpen(true);
                                    }
                                }}
                            />
                        ))}
                    </div>

                    {/* {incomesData?.pagination && incomesData.pagination.totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                currentPage={incomesData.pagination.page}
                                totalPages={incomesData.pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )} */}
                </>
            )}

            {/* Create Income Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Income</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <IncomeForm
                            defaultValues={getCreateFormDefaultValues()}
                            onSubmit={handleCreateIncome}
                            isSubmitting={isCreating}
                            submitButtonText="Add Income"
                            cancelButtonText="Cancel"
                            onCancel={() => setIsCreateDialogOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Income Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Income</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <IncomeForm
                            defaultValues={getEditFormDefaultValues()}
                            onSubmit={handleUpdateIncome}
                            isSubmitting={isUpdating}
                            submitButtonText="Save Changes"
                            cancelButtonText="Cancel"
                            onCancel={() => {
                                setIsEditDialogOpen(false);
                                setSelectedIncome(null);
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Income Dialog */}
            <DeleteIncomeDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedIncome(null);
                }}
                onConfirm={handleDeleteIncome}
                isDeleting={isDeleting}
                income={selectedIncome}
            />
        </div>
    );
};

export default IncomePage;