"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    useGetSemester,
    useUpdateSemester,
    useDeleteSemester
} from '@/hooks/expense-tracker/useSemesters';
import { UpdateSemesterRequest } from '@/types/expense-tracker/expenseTracker.types';
import { format } from 'date-fns';
import {
    Loader2,
    ArrowLeft,
    Calendar,
    Edit,
    Trash2,
    School,
    Calculator,
    Clock,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SemesterDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

const SemesterDetailPage = ({ params }: SemesterDetailPageProps) => {
    // Use React.use() to unwrap the params Promise
    const resolvedParams = React.use(params);
    const router = useRouter();
    const semesterId = resolvedParams.id;
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const { data: semester, isLoading } = useGetSemester(semesterId);
    const { mutate: updateSemester, isPending: isUpdating } = useUpdateSemester();
    const { mutate: deleteSemester, isPending: isDeleting } = useDeleteSemester();

    const handleSetActive = () => {
        if (!semester || semester.isActive) return;

        const updateData: UpdateSemesterRequest = {
            isActive: true
        };

        updateSemester({ id: semesterId, semesterData: updateData });
    };

    const handleDelete = () => {
        deleteSemester(semesterId, {
            onSuccess: () => {
                router.push('/dashboard/expense-tracker/semesters');
            }
        });
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

    // Calculate duration in weeks
    const startDate = new Date(semester.startDate);
    const endDate = new Date(semester.endDate);
    const durationInDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const durationInWeeks = Math.floor(durationInDays / 7);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/dashboard/expense-tracker/semesters')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-2xl font-bold">{semester.name}</h1>
                {semester.isActive && (
                    <Badge className="bg-green-500 hover:bg-green-600 ml-2">
                        Active
                    </Badge>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Semester Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <School className="h-5 w-5" />
                            Semester Details
                        </CardTitle>
                        <CardDescription>Basic information about this semester</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Term & Year</p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{semester.term}</Badge>
                                <span>{semester.year}</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Start Date</span>
                                    </div>
                                    <p className="font-medium">{format(startDate, 'MMM d, yyyy')}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">End Date</span>
                                    </div>
                                    <p className="font-medium">{format(endDate, 'MMM d, yyyy')}</p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{durationInWeeks} weeks ({durationInDays} days)</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">System Info</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Created</div>
                                <div className="text-right">{format(new Date(semester.createdAt), 'MMM d, yyyy')}</div>
                                <div>Last Updated</div>
                                <div className="text-right">{format(new Date(semester.updatedAt), 'MMM d, yyyy')}</div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 border-t p-4">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/dashboard/expense-tracker/semesters/edit/${semester.id}`)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-destructive hover:text-destructive"
                            onClick={() => setConfirmDelete(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </CardFooter>
                </Card>

                {/* Statistics Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Statistics
                        </CardTitle>
                        <CardDescription>Expense data and budget information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg border p-3">
                                <p className="text-xs font-medium text-muted-foreground">Total Expenses</p>
                                <h3 className="mt-1 text-2xl font-bold">{semester._count?.expenses || 0}</h3>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs font-medium text-muted-foreground">Budget Plans</p>
                                <h3 className="mt-1 text-2xl font-bold">{semester._count?.budgets || 0}</h3>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs font-medium text-muted-foreground">Payment Schedules</p>
                                <h3 className="mt-1 text-2xl font-bold">{semester._count?.paymentSchedules || 0}</h3>
                            </div>
                            <div className="rounded-lg border p-3">
                                <p className="text-xs font-medium text-muted-foreground">Status</p>
                                <h3 className="mt-1 text-lg font-bold">
                                    {semester.isActive ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                                    ) : (
                                        <Badge variant="outline">Inactive</Badge>
                                    )}
                                </h3>
                            </div>
                        </div>
                        {!semester.isActive && (
                            <Button
                                size="sm"
                                className="w-full"
                                onClick={handleSetActive}
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Set as Active Semester
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your semester data</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            <Button onClick={() => router.push(`/dashboard/expense-tracker/expenses?semesterId=${semester.id}`)}>
                                View Expenses
                            </Button>
                            <Button onClick={() => router.push(`/dashboard/expense-tracker/budgets/create?semesterId=${semester.id}`)}>
                                Create Budget Plan
                            </Button>
                            <Button onClick={() => router.push(`/dashboard/expense-tracker/reports?semesterId=${semester.id}`)}>
                                Generate Reports
                            </Button>
                            <Button variant="outline" onClick={() => router.push(`/dashboard/expense-tracker/semesters/edit/${semester.id}`)}>
                                Edit Semester Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Semester</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the semester "{semester.name}"? This action cannot be
                            undone and will remove all associated data including expenses, budgets, and payment schedules.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDelete(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SemesterDetailPage;
