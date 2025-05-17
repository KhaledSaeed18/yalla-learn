'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useGetJobDetails, useUpdateJob } from '@/hooks/jobs/useJobs';
import { UpdateJobRequest, JobType, JobStatus } from '@/types/jobs/jobs.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Form validation schema
const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    company: z.string().min(2, "Company name must be at least 2 characters"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    requirements: z.string().min(20, "Requirements must be at least 20 characters"),
    salary: z.string().optional().nullable(),
    type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
    status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT']),
    applicationUrl: z.union([
        z.string().url("Must be a valid URL"),
        z.string().max(0).transform(() => null), // Empty string becomes null
    ]).optional().nullable(),
    deadline: z.date().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const router = useRouter();
    const jobId = unwrappedParams.id;

    // Fetch job details
    const { data: job, isLoading, error } = useGetJobDetails(jobId);

    const updateJobMutation = useUpdateJob();

    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            company: '',
            location: '',
            description: '',
            requirements: '',
            salary: '',
            type: 'FULL_TIME' as JobType,
            status: 'ACTIVE' as JobStatus,
            applicationUrl: '',
            deadline: null,
        },
    });

    // Update form with job data when available
    useEffect(() => {
        if (job) {
            form.reset({
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                requirements: job.requirements,
                salary: job.salary || '',
                type: job.type,
                status: job.status,
                applicationUrl: job.applicationUrl || '',
                deadline: job.deadline ? new Date(job.deadline) : null,
            });
        }
    }, [job, form]);

    // Handle form submission
    const onSubmit = async (values: FormValues) => {
        // Convert date to ISO string if it exists
        const jobData: UpdateJobRequest = {
            ...values,
            deadline: values.deadline ? values.deadline.toISOString() : null,
        };

        try {
            await updateJobMutation.mutateAsync({
                id: jobId,
                jobData,
            });

            router.push(`/dashboard/jobs/${jobId}`);
        } catch (error) {
            toast.error("Failed to update job");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-2xl font-bold mb-4">Job not found</h1>
                <Button onClick={() => router.push('/dashboard/jobs/listings')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => router.push(`/dashboard/jobs/${jobId}`)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Job Details
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Job Listing</CardTitle>
                    <CardDescription>Update the job listing information below.</CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Senior Frontend Developer"
                                    {...form.register('title')}
                                />
                                {form.formState.errors.title && (
                                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    placeholder="e.g. Acme Inc"
                                    {...form.register('company')}
                                />
                                {form.formState.errors.company && (
                                    <p className="text-sm text-red-500">{form.formState.errors.company.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Remote, New York, NY"
                                    {...form.register('location')}
                                />
                                {form.formState.errors.location && (
                                    <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary (optional)</Label>
                                <Input
                                    id="salary"
                                    placeholder="e.g. $80,000 - $100,000"
                                    {...form.register('salary')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Job Type</Label>
                                <Controller
                                    name="type"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a job type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                                <SelectItem value="PART_TIME">Part Time</SelectItem>
                                                <SelectItem value="CONTRACT">Contract</SelectItem>
                                                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                                <SelectItem value="REMOTE">Remote</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.type && (
                                    <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="CLOSED">Closed</SelectItem>
                                                <SelectItem value="DRAFT">Draft</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {form.formState.errors.status && (
                                    <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="applicationUrl">Application URL (optional)</Label>
                                <Input
                                    id="applicationUrl"
                                    placeholder="e.g. https://your-company.com/careers/apply"
                                    {...form.register('applicationUrl')}
                                />
                                {form.formState.errors.applicationUrl && (
                                    <p className="text-sm text-red-500">{form.formState.errors.applicationUrl.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deadline">Application Deadline (optional)</Label>
                                <Controller
                                    name="deadline"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span className="text-muted-foreground">Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value || undefined}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <Textarea
                                id="description"
                                rows={6}
                                placeholder="Enter job description"
                                {...form.register('description')}
                            />
                            {form.formState.errors.description && (
                                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">Job Requirements</Label>
                            <Textarea
                                id="requirements"
                                rows={6}
                                placeholder="Enter job requirements"
                                {...form.register('requirements')}
                            />
                            {form.formState.errors.requirements && (
                                <p className="text-sm text-red-500">{form.formState.errors.requirements.message}</p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/jobs/${jobId}`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateJobMutation.isPending}
                        >
                            {updateJobMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update Job
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
