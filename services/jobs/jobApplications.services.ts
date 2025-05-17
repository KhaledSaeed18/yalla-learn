import { api } from '@/lib/api/baseAPI';
import {
    GetApplicationsResponse,
    GetApplicationResponse,
    CreateApplicationRequest,
    CreateApplicationResponse,
    UpdateApplicationStatusRequest,
    UpdateApplicationStatusResponse,
    ApplicationsQueryParams
} from '@/types/jobs/jobApplications.types';

export const jobApplicationServices = {
    /**
     * Apply for a job
     * @param jobId - The job ID to apply for
     * @param applicationData - The application data
     * @returns A promise that resolves to the created application response
     */
    applyForJob: (jobId: string, applicationData: CreateApplicationRequest) => {
        return api.post<CreateApplicationResponse>(
            `/jobs/apply/${jobId}`,
            applicationData
        );
    },

    /**
     * Get user's job applications with optional filtering, pagination, and sorting
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the user's applications response
     */
    getUserApplications: (params?: ApplicationsQueryParams) => {
        return api.get<GetApplicationsResponse>(
            '/jobs/applications/user',
            params
        );
    },

    /**
     * Get a specific application by ID
     * @param id - The application ID
     * @returns A promise that resolves to the application response
     */
    getApplicationById: (id: string) => {
        return api.get<GetApplicationResponse>(
            `/jobs/applications/${id}`
        );
    },

    /**
     * Admin: Get all applications for a specific job
     * @param jobId - The job ID
     * @param params - Query parameters for filtering, pagination, and sorting
     * @returns A promise that resolves to the applications response
     */
    getJobApplications: (jobId: string, params?: ApplicationsQueryParams) => {
        return api.get<GetApplicationsResponse>(
            `/jobs/admin/applications/${jobId}`,
            params
        );
    },

    /**
     * Admin: Update application status
     * @param id - The application ID to update
     * @param statusData - The updated status data
     * @returns A promise that resolves to the updated application response
     */
    updateApplicationStatus: (id: string, statusData: UpdateApplicationStatusRequest) => {
        return api.put<UpdateApplicationStatusResponse>(
            `/jobs/admin/applications/${id}/status`,
            statusData
        );
    }
};
