import { api } from '@/lib/api/baseAPI';
import {
    GetJobsResponse,
    GetJobResponse,
    CreateJobRequest,
    CreateJobResponse,
    UpdateJobRequest,
    UpdateJobResponse,
    DeleteJobResponse,
    JobsQueryParams,
    GetJobStatisticsResponse
} from '@/types/jobs/jobs.types';

export const jobServices = {
    /**
     * Browse all active jobs with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the jobs response
     */
    browseJobs: (params?: JobsQueryParams) => {
        return api.get<GetJobsResponse>(
            '/jobs/browse',
            params
        );
    },

    /**
     * Get job details by ID
     * @param id - The job ID
     * @returns A promise that resolves to the job details response
     */
    getJobDetails: (id: string) => {
        return api.get<GetJobResponse>(
            `/jobs/details/${id}`
        );
    },

    /**
     * Admin: Create a new job
     * @param jobData - The job data to create
     * @returns A promise that resolves to the created job response
     */
    createJob: (jobData: CreateJobRequest) => {
        return api.post<CreateJobResponse>(
            '/jobs/admin/create',
            jobData
        );
    },

    /**
     * Admin: Get all jobs with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the jobs response
     */
    getAllJobs: (params?: JobsQueryParams) => {
        return api.get<GetJobsResponse>(
            '/jobs/admin/all',
            params
        );
    },

    /**
     * Admin: Update an existing job
     * @param id - The job ID to update
     * @param jobData - The updated job data
     * @returns A promise that resolves to the updated job response
     */
    updateJob: (id: string, jobData: UpdateJobRequest) => {
        return api.put<UpdateJobResponse>(
            `/jobs/admin/update/${id}`,
            jobData
        );
    },

    /**
     * Admin: Delete a job
     * @param id - The job ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteJob: (id: string) => {
        return api.delete<DeleteJobResponse>(
            `/jobs/admin/delete/${id}`
        );
    },

    /**
     * Admin: Get job statistics
     * @returns A promise that resolves to the job statistics response
     */
    getJobStatistics: () => {
        return api.get<GetJobStatisticsResponse>(
            '/jobs/admin/statistics'
        );
    }
};
