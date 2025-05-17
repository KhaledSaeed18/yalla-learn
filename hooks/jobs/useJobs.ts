import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobServices } from '@/services/jobs/jobs.services';
import {
    JobsQueryParams,
    CreateJobRequest,
    UpdateJobRequest,
    Job
} from '@/types/jobs/jobs.types';
import { toast } from 'sonner';

// Query keys
export const jobKeys = {
    all: ['jobs'] as const,
    lists: () => [...jobKeys.all, 'list'] as const,
    list: (params?: JobsQueryParams) => [...jobKeys.lists(), { params }] as const,
    details: () => [...jobKeys.all, 'detail'] as const,
    detail: (id: string) => [...jobKeys.details(), id] as const,
    browse: () => [...jobKeys.all, 'browse'] as const,
    browseList: (params?: JobsQueryParams) => [...jobKeys.browse(), { params }] as const,
    admin: () => [...jobKeys.all, 'admin'] as const,
    adminList: (params?: JobsQueryParams) => [...jobKeys.admin(), { params }] as const,
    statistics: () => [...jobKeys.all, 'statistics'] as const,
};

// Browse all active jobs hook with optional filtering, pagination, and sorting
export const useBrowseJobs = (params?: JobsQueryParams) => {
    return useQuery({
        queryKey: jobKeys.browseList(params),
        queryFn: async () => {
            const response = await jobServices.browseJobs(params);
            return {
                jobs: response.data.jobs,
                pagination: response.data.pagination
            };
        },
    });
};

// Get job details hook by ID
export const useGetJobDetails = (id: string) => {
    return useQuery({
        queryKey: jobKeys.detail(id),
        queryFn: async () => {
            const response = await jobServices.getJobDetails(id);
            return response.data.job;
        },
        enabled: !!id,
    });
};

// Admin: Get all jobs hook with optional filtering, pagination, and sorting
export const useGetAllJobs = (params?: JobsQueryParams) => {
    return useQuery({
        queryKey: jobKeys.adminList(params),
        queryFn: async () => {
            const response = await jobServices.getAllJobs(params);
            return {
                jobs: response.data.jobs,
                pagination: response.data.pagination
            };
        },
    });
};

// Admin: Create job hook
export const useCreateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (jobData: CreateJobRequest) =>
            jobServices.createJob(jobData),
        onSuccess: (response) => {
            queryClient.setQueryData(
                jobKeys.adminList(),
                (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        jobs: [response.data.job, ...oldData.jobs],
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: jobKeys.statistics(),
            });

            queryClient.invalidateQueries({
                queryKey: jobKeys.admin(),
            });

            toast.success("Job created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create job');
        },
    });
};

// Admin: Update job hook
export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, jobData }: { id: string; jobData: UpdateJobRequest }) =>
            jobServices.updateJob(id, jobData),
        onSuccess: (response, { id }) => {
            queryClient.setQueryData(
                jobKeys.detail(id),
                (oldData: Job | undefined) => {
                    if (!oldData) return response.data.job;
                    return {
                        ...oldData,
                        ...response.data.job,
                    };
                }
            );

            queryClient.getQueriesData({ queryKey: jobKeys.admin() }).forEach(([queryKey, queryData]) => {
                if (!queryData) return;
                queryClient.setQueryData(queryKey, {
                    ...queryData,
                    jobs: (queryData as any).jobs.map((job: Job) =>
                        job.id === id ? { ...job, ...response.data.job } : job
                    ),
                });
            });

            queryClient.invalidateQueries({
                queryKey: jobKeys.browse(),
            });

            queryClient.invalidateQueries({
                queryKey: jobKeys.statistics(),
            });

            toast.success('Job updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update job');
        },
    });
};

// Admin: Delete job hook
export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => jobServices.deleteJob(id),
        onSuccess: (_, id) => {
            queryClient.getQueriesData({ queryKey: jobKeys.admin() }).forEach(([queryKey, queryData]) => {
                if (!queryData) return;
                queryClient.setQueryData(queryKey, {
                    ...queryData,
                    jobs: (queryData as any).jobs.filter((job: Job) => job.id !== id),
                });
            });

            queryClient.removeQueries({
                queryKey: jobKeys.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: jobKeys.statistics(),
            });

            queryClient.invalidateQueries({
                queryKey: jobKeys.browse(),
            });

            toast.success('Job deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete job');
        },
    });
};

// Admin: Get job statistics hook
export const useGetJobStatistics = () => {
    return useQuery({
        queryKey: jobKeys.statistics(),
        queryFn: async () => {
            const response = await jobServices.getJobStatistics();
            return response.data.statistics;
        },
    });
};
