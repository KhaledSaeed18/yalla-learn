'use client';

import { useRouter } from 'next/navigation';
import { useCreateJob } from '@/hooks/jobs/useJobs';
import { JobForm } from '@/components/jobs/admin/JobForm';
import { CreateJobRequest } from '@/types/jobs/jobs.types';
import { toast } from 'sonner';

export default function CreateJobPage() {
    const router = useRouter();
    const createJobMutation = useCreateJob();

    const handleCreateJob = async (jobData: CreateJobRequest) => {
        try {
            const response = await createJobMutation.mutateAsync(jobData);

            toast(
                "Job created successfully",
                {
                    description: "Your job listing has been created successfully.",
                }
            )

            router.push(`/dashboard/jobs/${response.data.job.id}`);
        } catch (error: any) {
            toast("Error creating job", {
                description: error.message || "An error occurred while creating the job listing.",
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <JobForm onSubmit={handleCreateJob} isSubmitting={createJobMutation.isPending} />
        </div>
    );
}
