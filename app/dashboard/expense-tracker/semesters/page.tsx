"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useGetSemesters,
    useCreateSemester,
    useUpdateSemester,
    useDeleteSemester,
    useGetActiveSemester
} from '@/hooks/expense-tracker/useSemesters';
import {
    CreateSemesterRequest,
    UpdateSemesterRequest,
    Semester,
    Term
} from '@/types/expense-tracker/expenseTracker.types';
import { format } from 'date-fns';
import * as z from 'zod';
import { Loader2, Plus, Edit, Trash2, Calendar, ArrowUpDown, FilePen } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Custom Components
import { SemesterForm, semesterFormSchema } from '@/components/expense-tracker/SemesterForm';
import { DeleteSemesterDialog } from '@/components/expense-tracker/DeleteSemesterDialog';
import { SemesterCard } from '@/components/expense-tracker/SemesterCard';

const SemestersPage = () => {
    const router = useRouter();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    // Custom hooks for CRUD operations
    const { data: semesters, isLoading: isLoadingSemesters } = useGetSemesters();
    const { data: activeSemester } = useGetActiveSemester();
    const { mutate: createSemester, isPending: isCreating } = useCreateSemester();
    const { mutate: updateSemester, isPending: isUpdating } = useUpdateSemester();
    const { mutate: deleteSemester, isPending: isDeleting } = useDeleteSemester();

    // Handle dialog opening for creating a new semester
    const handleOpenCreateDialog = () => {
        setEditingSemester(null);
        setOpenDialog(true);
    };

    // Handle dialog opening for editing an existing semester
    const handleOpenEditDialog = (semester: Semester) => {
        setEditingSemester(semester);
        setOpenDialog(true);
    };

    // Get form default values
    const getFormDefaultValues = () => {
        if (editingSemester) {
            return {
                name: editingSemester.name,
                term: editingSemester.term,
                year: editingSemester.year,
                startDate: new Date(editingSemester.startDate),
                endDate: new Date(editingSemester.endDate),
                isActive: editingSemester.isActive,
            };
        }

        return {
            name: '',
            term: 'FALL' as Term,
            year: new Date().getFullYear(),
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
            isActive: false,
        };
    };

    // Handle form submission for creating or updating a semester
    const onSubmit = (values: z.infer<typeof semesterFormSchema>) => {
        if (editingSemester) {
            // Update existing semester
            const updateData: UpdateSemesterRequest = {
                name: values.name,
                term: values.term,
                year: values.year,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                isActive: values.isActive,
            };

            updateSemester(
                { id: editingSemester.id, semesterData: updateData },
                {
                    onSuccess: () => {
                        setOpenDialog(false);
                        setEditingSemester(null);
                    }
                }
            );
        } else {
            // Create new semester
            const createData: CreateSemesterRequest = {
                name: values.name,
                term: values.term,
                year: values.year,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                isActive: values.isActive,
            };

            createSemester(createData, {
                onSuccess: () => {
                    setOpenDialog(false);
                }
            });
        }
    };

    // Handle delete confirmation
    const handleDeleteClick = (id: string, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation();
        }
        setSelectedSemesterId(id);
        setConfirmDelete(true);
    };

    // Execute semester deletion
    const handleConfirmDelete = () => {
        if (selectedSemesterId) {
            deleteSemester(selectedSemesterId, {
                onSuccess: () => {
                    setConfirmDelete(false);
                    setSelectedSemesterId(null);
                }
            });
        }
    };

    // Close delete dialog
    const handleCloseDeleteDialog = () => {
        setConfirmDelete(false);
        setSelectedSemesterId(null);
    };

    // Render loading state
    if (isLoadingSemesters) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    // Find the semester being deleted (for the dialog title)
    const semesterToDelete = semesters?.find(s => s.id === selectedSemesterId);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Semesters Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage your academic semesters for expense tracking
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "grid")}>
                        <TabsList className="grid w-[160px] grid-cols-2">
                            <TabsTrigger value="table">Table View</TabsTrigger>
                            <TabsTrigger value="grid">Grid View</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button onClick={handleOpenCreateDialog}>
                        <Plus className="mr-2 h-4 w-4" /> Add Semester
                    </Button>
                </div>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-medium">Name</TableHead>
                                <TableHead className="font-medium">Term & Year</TableHead>
                                <TableHead className="font-medium">Duration</TableHead>
                                <TableHead className="font-medium">Status</TableHead>
                                <TableHead className="font-medium text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {semesters && semesters.length > 0 ? (
                                semesters.map((semester) => (
                                    <TableRow key={semester.id}>
                                        <TableCell className="font-medium">{semester.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <Badge variant="outline" className="mb-1 w-fit">
                                                    {semester.term}
                                                </Badge>
                                                <span>{semester.year}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {format(new Date(semester.startDate), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {format(new Date(semester.endDate), 'MMM d, yyyy')}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {semester.isActive ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenEditDialog(semester)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => handleDeleteClick(semester.id, e)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No semesters found. Click &quot;Add Semester&quot; to create your first semester.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {semesters && semesters.length > 0 ? (
                        semesters.map((semester) => (
                            <SemesterCard
                                key={semester.id}
                                semester={semester}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-muted-foreground rounded-md border bg-card">
                            No semesters found. Click &quot;Add Semester&quot; to create your first semester.
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Semester Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSemester ? 'Edit Semester' : 'Create New Semester'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSemester
                                ? 'Update the semester details below.'
                                : 'Fill in the details to create a new semester.'}
                        </DialogDescription>
                    </DialogHeader>

                    <SemesterForm
                        defaultValues={getFormDefaultValues()}
                        onSubmit={onSubmit}
                        isSubmitting={isCreating || isUpdating}
                        submitButtonText={editingSemester ? 'Update Semester' : 'Create Semester'}
                        cancelButtonText="Cancel"
                        onCancel={() => setOpenDialog(false)}
                        showActiveWarning={!!editingSemester}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteSemesterDialog
                isOpen={confirmDelete}
                isDeleting={isDeleting}
                semesterName={semesterToDelete?.name || "this semester"}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default SemestersPage;
