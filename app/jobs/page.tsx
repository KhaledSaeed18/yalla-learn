'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBrowseJobs } from '@/hooks/jobs/useJobs';
import { JobType, Job } from '@/types/jobs/jobs.types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { JobCard } from '@/components/jobs/JobCard';

export default function JobsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [jobType, setJobType] = useState<JobType | 'ALL'>('ALL');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, error } = useBrowseJobs({
        page,
        limit,
        search: search || undefined,
        type: jobType !== 'ALL' ? (jobType as JobType) : undefined,
        status: 'ACTIVE',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const handleJobTypeChange = (value: string) => {
        setJobType(value as JobType | 'ALL');
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleViewJob = (id: string) => {
        router.push(`/jobs/${id}`);
    };

    const jobTypeOptions = [
        { value: 'ALL', label: 'All Types' },
        { value: 'FULL_TIME', label: 'Full-time' },
        { value: 'PART_TIME', label: 'Part-time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'INTERNSHIP', label: 'Internship' },
        { value: 'REMOTE', label: 'Remote' },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Find Your Next Opportunity</h1>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={jobType} onValueChange={handleJobTypeChange}>
                    <SelectTrigger className="w-full md:w-[180px]">
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
            </form>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-500">Failed to load jobs. Please try again.</p>
                </div>
            ) : !data || data.jobs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground">No jobs found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        {data.jobs.map((job: Job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onView={handleViewJob}
                            />
                        ))}
                    </div>

                    {data.pagination && (
                        <PaginationComponent
                            currentPage={data.pagination.page || page}
                            totalPages={data.pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}
