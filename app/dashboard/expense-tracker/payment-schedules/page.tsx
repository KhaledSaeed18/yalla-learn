"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
    useGetPaymentSchedules,
    useCreatePaymentSchedule,
    useUpdatePaymentSchedule,
    useDeletePaymentSchedule
} from '@/hooks/expense-tracker/usePaymentSchedules';
import { useGetActiveSemester, useGetSemesters } from '@/hooks/expense-tracker/useSemesters';
import { PaymentScheduleForm, PaymentScheduleFormValues } from '@/components/expense-tracker/PaymentScheduleForm';
import { PaymentScheduleCard } from '@/components/expense-tracker/PaymentScheduleCard';
import { DeletePaymentScheduleDialog } from '@/components/expense-tracker/DeletePaymentScheduleDialog';
import { PaymentSchedule, PaymentSchedulesQueryParams, PaymentType } from '@/types/expense-tracker/expenseTracker.types';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Search, FilterX } from 'lucide-react';

const PaymentSchedulesPage = () => {
    const [filters, setFilters] = useState<PaymentSchedulesQueryParams>({
        sortBy: 'dueDate',
        sortOrder: 'asc'
    });

    const [activeTab, setActiveTab] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedPaymentSchedule, setSelectedPaymentSchedule] = useState<PaymentSchedule | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch data using custom hooks
    const { data: activeSemester } = useGetActiveSemester();
    const { data: semesters, isLoading: isLoadingSemesters } = useGetSemesters();
    const { data: paymentSchedulesData, isLoading: isLoadingPaymentSchedules } =
        useGetPaymentSchedules(filters);

    // Mutation hooks
    const { mutate: createPaymentSchedule, isPending: isCreating } = useCreatePaymentSchedule();
    const { mutate: updatePaymentSchedule, isPending: isUpdating } = useUpdatePaymentSchedule();
    const { mutate: deletePaymentSchedule, isPending: isDeleting } = useDeletePaymentSchedule();

    // Set active semester as default filter when it loads
    useEffect(() => {
        if (activeSemester && !filters.semesterId) {
            setFilters(prev => ({
                ...prev,
                semesterId: activeSemester.id
            }));
        }
    }, [activeSemester, filters.semesterId]);

    // Update filters when tab changes
    useEffect(() => {
        const newFilters: Partial<PaymentSchedulesQueryParams> = {};

        if (activeTab === "upcoming") {
            newFilters.upcoming = true;
            newFilters.isPaid = false;
        } else if (activeTab === "overdue") {
            newFilters.overdue = true;
            newFilters.isPaid = false;
        } else if (activeTab === "paid") {
            newFilters.isPaid = true;
        } else if (activeTab === "unpaid") {
            newFilters.isPaid = false;
        }

        setFilters(prev => ({
            ...prev,
            ...newFilters,
        }));
    }, [activeTab]);

    // Form handlers
    const handleCreatePaymentSchedule = (data: PaymentScheduleFormValues) => {
        createPaymentSchedule({
            name: data.name,
            amount: data.amount,
            dueDate: format(data.dueDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
            isPaid: data.isPaid,
            paidDate: data.paidDate
                ? format(data.paidDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'')
                : null,
            semesterId: data.semesterId,
            paymentType: data.paymentType as PaymentType,
            notes: data.notes || null
        }, {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
            }
        });
    };

    const handleUpdatePaymentSchedule = (data: PaymentScheduleFormValues) => {
        if (selectedPaymentSchedule) {
            updatePaymentSchedule({
                id: selectedPaymentSchedule.id,
                paymentScheduleData: {
                    name: data.name,
                    amount: data.amount,
                    dueDate: format(data.dueDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
                    isPaid: data.isPaid,
                    paidDate: data.paidDate
                        ? format(data.paidDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'')
                        : null,
                    semesterId: data.semesterId,
                    paymentType: data.paymentType as PaymentType,
                    notes: data.notes || null
                }
            }, {
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setSelectedPaymentSchedule(null);
                }
            });
        }
    };

    const handleDeletePaymentSchedule = () => {
        if (selectedPaymentSchedule) {
            deletePaymentSchedule(selectedPaymentSchedule.id, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedPaymentSchedule(null);
                }
            });
        }
    };

    // Prepare default values for create form
    const getCreateFormDefaultValues = (): PaymentScheduleFormValues => {
        return {
            name: '',
            amount: 0,
            dueDate: new Date(),
            isPaid: false,
            paidDate: null,
            semesterId: activeSemester?.id || '',
            paymentType: 'TUITION',
            notes: ''
        };
    };

    // Prepare default values for edit form
    const getEditFormDefaultValues = (): PaymentScheduleFormValues => {
        if (!selectedPaymentSchedule) return getCreateFormDefaultValues();

        return {
            name: selectedPaymentSchedule.name,
            amount: selectedPaymentSchedule.amount,
            dueDate: new Date(selectedPaymentSchedule.dueDate),
            isPaid: selectedPaymentSchedule.isPaid,
            paidDate: selectedPaymentSchedule.paidDate ? new Date(selectedPaymentSchedule.paidDate) : null,
            semesterId: selectedPaymentSchedule.semesterId,
            paymentType: selectedPaymentSchedule.paymentType,
            notes: selectedPaymentSchedule.notes || ''
        };
    };

    // Reset filters handler
    const handleResetFilters = () => {
        setFilters({

            sortBy: 'dueDate',
            sortOrder: 'asc',
            semesterId: activeSemester?.id
        });
        setActiveTab("all");
    };

    // Handle filter change
    const handleFilterChange = (field: keyof PaymentSchedulesQueryParams, value: any) => {
        setFilters(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (isLoadingSemesters || (isLoadingPaymentSchedules && !paymentSchedulesData)) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payment Schedules</h1>
                    <p className="text-muted-foreground">
                        Manage your upcoming tuition, housing, and other educational payments.
                    </p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Payment
                </Button>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-4 w-full">

                    <div className="flex flex-1 gap-2">
                        <Select
                            value={filters.semesterId || 'all-semesters'}
                            onValueChange={(value) => handleFilterChange('semesterId', value === 'all-semesters' ? undefined : value)}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="All Semesters" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters?.map((semester) => (
                                    <SelectItem key={semester.id} value={semester.id}>
                                        {semester.name} {semester.isActive && "- Active"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.paymentType || 'all-types'}
                            onValueChange={(value) => handleFilterChange('paymentType', value === 'all-types' ? undefined : value)}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-types">All Types</SelectItem>
                                {['TUITION', 'HOUSING', 'MEAL_PLAN', 'BOOKS', 'LAB_FEES', 'ACTIVITY_FEES', 'TECHNOLOGY_FEES', 'INSURANCE', 'PARKING', 'OTHER'].map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type.replace('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={handleResetFilters} className="px-3">
                            <FilterX className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Reset</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Payment Schedule Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paymentSchedulesData?.paymentSchedules.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <h3 className="text-lg font-medium">No payment schedules found</h3>
                        <p className="text-muted-foreground">
                            {filters.semesterId
                                ? "Try changing your filters or create a new payment schedule."
                                : "Create your first payment schedule to start tracking your educational expenses."}
                        </p>
                        <Button
                            className="mt-4"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Payment
                        </Button>
                    </div>
                ) : (
                    paymentSchedulesData?.paymentSchedules.map((paymentSchedule) => (
                        <PaymentScheduleCard
                            key={paymentSchedule.id}
                            paymentSchedule={paymentSchedule}
                            onEdit={(ps) => {
                                setSelectedPaymentSchedule(ps);
                                setIsEditDialogOpen(true);
                            }}
                            onDelete={(id) => {
                                const ps = paymentSchedulesData.paymentSchedules.find(p => p.id === id);
                                if (ps) {
                                    setSelectedPaymentSchedule(ps);
                                    setIsDeleteDialogOpen(true);
                                }
                            }}
                        />
                    ))
                )}
            </div>

            {/* Create Payment Schedule Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add Payment Schedule</DialogTitle>
                        <DialogDescription>
                            Create a new payment schedule for your educational expenses.
                        </DialogDescription>
                    </DialogHeader>
                    <PaymentScheduleForm
                        defaultValues={getCreateFormDefaultValues()}
                        onSubmit={handleCreatePaymentSchedule}
                        isSubmitting={isCreating}
                        submitButtonText="Create"
                        onCancel={() => setIsCreateDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Payment Schedule Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Payment Schedule</DialogTitle>
                        <DialogDescription>
                            Update the details of this payment schedule.
                        </DialogDescription>
                    </DialogHeader>
                    <PaymentScheduleForm
                        defaultValues={getEditFormDefaultValues()}
                        onSubmit={handleUpdatePaymentSchedule}
                        isSubmitting={isUpdating}
                        submitButtonText="Update"
                        onCancel={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Payment Schedule Dialog */}
            <DeletePaymentScheduleDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeletePaymentSchedule}
                isDeleting={isDeleting}
                paymentScheduleName={selectedPaymentSchedule?.name}
            />
        </div>
    );
};

export default PaymentSchedulesPage;