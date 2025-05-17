'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetUserApplications } from '@/hooks/jobs/useJobApplications';
import { ApplicationStatus } from '@/types/jobs/jobApplications.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ApplicationCard } from '@/components/jobs/ApplicationCard';
import { Pagination } from '@/components/shared/Pagination';
import { Loader2 } from 'lucide-react';

export default function UserApplicationsPage() {
    const router = useRouter();

    const [status, setStatus] = useState<ApplicationStatus | 'ALL'>('ALL');
    const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'status'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useGetUserApplications({
        page,
        limit,
        status: status !== 'ALL' ? status : undefined,
        sortBy,
        sortOrder,
    });

    const handleViewApplication = (id: string) => {
        router.push(`/dashboard/jobs/applications/${id}`);
    };

    const statusOptions = [
        { value: 'ALL', label: 'All Statuses' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'UNDER_REVIEW', label: 'Under Review' },
        { value: 'SHORTLISTED', label: 'Shortlisted' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'REJECTED', label: 'Rejected' },
    ];

    const sortOptions = [
        { value: 'createdAt:desc', label: 'Newest First' },
        { value: 'createdAt:asc', label: 'Oldest First' },
        { value: 'updatedAt:desc', label: 'Recently Updated' },
        { value: 'status:asc', label: 'Status (A-Z)' },
        { value: 'status:desc', label: 'Status (Z-A)' },
    ];

    const handleSortChange = (value: string) => {
        const [sortByValue, sortOrderValue] = value.split(':');
        setSortBy(sortByValue as 'createdAt' | 'updatedAt' | 'status');
        setSortOrder(sortOrderValue as 'asc' | 'desc');
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <Button onClick={() => router.push('/jobs')} variant="outline" className="shrink-0">
                    Find Jobs
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
                <Select value={status} onValueChange={(value) => setStatus(value as ApplicationStatus | 'ALL')}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={`${sortBy}:${sortOrder}`}
                    onValueChange={handleSortChange}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>My Job Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : data?.applications.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You haven't applied to any jobs yet.</p>
                            <Button
                                onClick={() => router.push('/jobs')}
                                className="mt-4"
                            >
                                Browse Jobs
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {data?.applications.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                    onView={handleViewApplication}
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
        </div>
    );
}
