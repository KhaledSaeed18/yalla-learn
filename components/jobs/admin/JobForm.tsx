import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateJobRequest, JobType, JobStatus, Job } from '@/types/jobs/jobs.types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

// Form schema using zod for validation
const jobSchema = z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company name is required'),
    location: z.string().min(1, 'Location is required'),
    description: z.string().min(1, 'Job description is required'),
    requirements: z.string().min(1, 'Job requirements is required'),
    salary: z.string().nullable(),
    type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
    status: z.enum(['ACTIVE', 'CLOSED', 'DRAFT']),
    applicationUrl: z.string().nullable(),
    deadline: z.date().nullable(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
    job?: Job;
    onSubmit: (data: CreateJobRequest) => Promise<void>;
    isSubmitting: boolean;
}

export function JobForm({ job, onSubmit, isSubmitting }: JobFormProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        job?.deadline ? new Date(job.deadline) : undefined
    );

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<JobFormValues>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: job?.title || '',
            company: job?.company || '',
            location: job?.location || '',
            description: job?.description || '',
            requirements: job?.requirements || '',
            salary: job?.salary || '',
            type: job?.type || 'FULL_TIME',
            status: job?.status || 'DRAFT',
            applicationUrl: job?.applicationUrl || '',
            deadline: job?.deadline ? new Date(job.deadline) : null,
        },
    });

    // Handle date changes
    useEffect(() => {
        setValue('deadline', selectedDate || null);
    }, [selectedDate, setValue]);

    const jobTypes: { value: JobType; label: string }[] = [
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'INTERNSHIP', label: 'Internship' },
        { value: 'REMOTE', label: 'Remote' },
    ];

    const jobStatuses: { value: JobStatus; label: string }[] = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'CLOSED', label: 'Closed' },
        { value: 'DRAFT', label: 'Draft' },
    ];

    const handleFormSubmit = async (data: JobFormValues) => {
        // Format the date to ISO string or null
        const formattedData = {
            ...data,
            deadline: data.deadline ? data.deadline.toISOString() : null,
        };

        await onSubmit(formattedData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{job ? 'Edit Job' : 'Create New Job'}</CardTitle>
                <CardDescription>
                    Fill in the details below to {job ? 'update this job listing' : 'create a new job listing'}.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                {...register('title')}
                                placeholder="Senior Frontend Developer"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company">Company *</Label>
                            <Input
                                id="company"
                                {...register('company')}
                                placeholder="Acme Inc."
                            />
                            {errors.company && (
                                <p className="text-sm text-red-500">{errors.company.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                {...register('location')}
                                placeholder="New York, NY (Remote)"
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary (optional)</Label>
                            <Input
                                id="salary"
                                {...register('salary')}
                                placeholder="$100,000 - $120,000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Job Type *</Label>
                            <Select
                                onValueChange={(value) => setValue('type', value as JobType)}
                                defaultValue={watch('type')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                onValueChange={(value) => setValue('status', value as JobStatus)}
                                defaultValue={watch('status')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobStatuses.map(status => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-500">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="applicationUrl">External Application URL (optional)</Label>
                            <Input
                                id="applicationUrl"
                                {...register('applicationUrl')}
                                placeholder="https://jobs.example.com/apply"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Application Deadline (optional)</Label>
                            <DatePicker
                                date={selectedDate}
                                onSelect={setSelectedDate}
                                placeholder="Select a deadline"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Job Description *</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Enter detailed job description..."
                            rows={5}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="requirements">Job Requirements *</Label>
                        <Textarea
                            id="requirements"
                            {...register('requirements')}
                            placeholder="Enter job requirements, qualifications, etc..."
                            rows={5}
                        />
                        {errors.requirements && (
                            <p className="text-sm text-red-500">{errors.requirements.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between mt-2">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {job ? 'Update Job' : 'Create Job'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
