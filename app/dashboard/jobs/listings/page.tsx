'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetAllJobs, useDeleteJob } from '@/hooks/jobs/useJobs';
import { JobType, JobStatus } from '@/types/jobs/jobs.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2, Search, Plus } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { JobCard } from '@/components/jobs/JobCard';
import { toast } from 'sonner';

export default function JobsListingPage() {
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [jobType, setJobType] = useState<JobType | 'ALL'>('ALL');
    const [jobStatus, setJobStatus] = useState<JobStatus | 'ALL'>('ALL');
    const [page, setPage] = useState(1);
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);

    const limit = 10;

    const { data, isLoading } = useGetAllJobs({
        page,
        limit,
        search: search || undefined,
        type: jobType !== 'ALL' ? (jobType as JobType) : undefined,
        status: jobStatus !== 'ALL' ? (jobStatus as JobStatus) : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const deleteJobMutation = useDeleteJob();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const handleViewJob = (id: string) => {
        router.push(`/dashboard/jobs/${id}`);
    };

    const handleEditJob = (id: string) => {
        router.push(`/dashboard/jobs/${id}/edit`);
    };

    const handleDeleteJob = async () => {
        if (!jobToDelete) return;

        try {
            await deleteJobMutation.mutateAsync(jobToDelete);
            toast("Job deleted successfully");
            setJobToDelete(null);
        } catch (error) {
            toast("Error deleting job", {
                description: "An error occurred while deleting the job listing.",
            });
        }
    };

    const jobTypeOptions = [
        { value: 'ALL', label: 'All Types' },
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'INTERNSHIP', label: 'Internship' },
        { value: 'REMOTE', label: 'Remote' },
    ];

    const jobStatusOptions = [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'CLOSED', label: 'Closed' },
        { value: 'DRAFT', label: 'Draft' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search jobs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </form>

                <Button onClick={() => router.push('/dashboard/jobs/create')} className="shrink-0">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Job
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
                <Select value={jobStatus} onValueChange={(value) => setJobStatus(value as JobStatus | 'ALL')}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {jobStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={jobType} onValueChange={(value) => setJobType(value as JobType | 'ALL')}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {jobTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleSearch}>Apply Filters</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Listings</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : data?.jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearch('');
                                    setJobType('ALL');
                                    setJobStatus('ALL');
                                    setPage(1);
                                }}
                                className="mt-4"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {data?.jobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onView={handleViewJob}
                                    onEdit={handleEditJob}
                                    onDelete={setJobToDelete}
                                    isAdmin={true}
                                />
                            ))}

                            {data?.pagination && data.pagination.totalPages > 1 && (
                                <div className="mt-6">
                                    <Pagination
                                        currentPage={page}
                                        totalPages={data.pagination.totalPages}
                                        onPageChange={setPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!jobToDelete} onOpenChange={(open) => !open && setJobToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the job listing and all associated applications.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteJob}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteJobMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
