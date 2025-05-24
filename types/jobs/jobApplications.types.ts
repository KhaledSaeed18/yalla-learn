import { JobType, JobStatus } from './jobs.types';

export interface JobRef {
    id: string;
    title: string;
    company: string;
    type: JobType;
    status: JobStatus;
}

export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

export interface JobApplicant {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    email: string;
}

export interface JobApplication {
    id: string;
    jobId: string;
    applicantId: string;
    coverLetter: string | null;
    resume: string | null;
    status: ApplicationStatus;
    createdAt: string;
    updatedAt: string;
    job?: JobRef;
    applicant?: JobApplicant;
}

export interface ApplicationsQueryParams {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    jobId?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'status';
    sortOrder?: 'asc' | 'desc';
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GetApplicationsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        applications: JobApplication[];
        pagination: Pagination;
    };
}

export interface GetApplicationResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        application: JobApplication;
    };
}

export interface CreateApplicationRequest {
    jobId: string;
    coverLetter?: string | null;
    resume?: string | null;
}

export interface CreateApplicationResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        application: JobApplication;
    };
}

export interface UpdateApplicationStatusRequest {
    status: ApplicationStatus;
}

export interface UpdateApplicationStatusResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        application: JobApplication;
    };
}

export interface ApplicationError {
    message: string;
    status?: number;
}
