import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobApplicationServices } from '@/services/jobs/jobApplications.services';
import {
    ApplicationsQueryParams,
    CreateApplicationRequest,
    UpdateApplicationStatusRequest,
    JobApplication
} from '@/types/jobs/jobApplications.types';
import { jobKeys } from './useJobs';
import { toast } from 'sonner';

// Query keys
export const applicationKeys = {
    all: ['jobApplications'] as const,
    lists: () => [...applicationKeys.all, 'list'] as const,
    list: (params?: ApplicationsQueryParams) => [...applicationKeys.lists(), { params }] as const,
    details: () => [...applicationKeys.all, 'detail'] as const,
    detail: (id: string) => [...applicationKeys.details(), id] as const,
    user: () => [...applicationKeys.all, 'user'] as const,
    userList: (params?: ApplicationsQueryParams) => [...applicationKeys.user(), { params }] as const,
    job: () => [...applicationKeys.all, 'job'] as const,
    jobList: (jobId: string, params?: ApplicationsQueryParams) => [...applicationKeys.job(), jobId, { params }] as const,
};

// Apply for job hook
export const useApplyForJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ jobId, applicationData }: { jobId: string; applicationData: CreateApplicationRequest }) =>
            jobApplicationServices.applyForJob(jobId, applicationData),
        onSuccess: (response, { jobId }) => {
            // Update user applications cache
            queryClient.getQueriesData({ queryKey: applicationKeys.user() }).forEach(([queryKey, queryData]) => {
                if (!queryData) return;
                queryClient.setQueryData(queryKey, {
                    ...queryData,
                    applications: [response.data.application, ...(queryData as any).applications],
                });
            });

            // Update job detail to reflect the new application
            queryClient.setQueryData(
                jobKeys.detail(jobId),
                (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        applications: [...(oldData.applications || []), response.data.application]
                    };
                }
            );

            toast.success("Application submitted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to submit application');
        },
    });
};

// Get user applications hook
export const useGetUserApplications = (params?: ApplicationsQueryParams) => {
    return useQuery({
        queryKey: applicationKeys.userList(params),
        queryFn: async () => {
            const response = await jobApplicationServices.getUserApplications(params);
            return {
                applications: response.data.applications,
                pagination: response.data.pagination
            };
        },
    });
};

// Get application details hook
export const useGetApplicationById = (id: string) => {
    return useQuery({
        queryKey: applicationKeys.detail(id),
        queryFn: async () => {
            const response = await jobApplicationServices.getApplicationById(id);
            return response.data.application;
        },
        enabled: !!id,
    });
};

// Admin: Get all applications for a job hook
export const useGetJobApplications = (jobId: string, params?: ApplicationsQueryParams) => {
    return useQuery({
        queryKey: applicationKeys.jobList(jobId, params),
        queryFn: async () => {
            const response = await jobApplicationServices.getJobApplications(jobId, params);
            return {
                applications: response.data.applications,
                pagination: response.data.pagination
            };
        },
        enabled: !!jobId,
    });
};

// Admin: Update application status hook
export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, statusData }: { id: string; statusData: UpdateApplicationStatusRequest }) =>
            jobApplicationServices.updateApplicationStatus(id, statusData),
        onSuccess: (response, { id }) => {
            // Update application detail cache
            queryClient.setQueryData(
                applicationKeys.detail(id),
                (oldData: JobApplication | undefined) => {
                    if (!oldData) return response.data.application;
                    return {
                        ...oldData,
                        ...response.data.application,
                    };
                }
            );

            // Update application lists that might contain this application
            queryClient.getQueriesData({ queryKey: applicationKeys.lists() }).forEach(([queryKey, queryData]) => {
                if (!queryData) return;
                queryClient.setQueryData(queryKey, {
                    ...queryData,
                    applications: (queryData as any).applications.map((app: JobApplication) =>
                        app.id === id ? { ...app, ...response.data.application } : app
                    ),
                });
            });

            // Update job statistics since application status changed
            queryClient.invalidateQueries({
                queryKey: jobKeys.statistics(),
            });

            toast.success('Application status updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update application status');
        },
    });
};
