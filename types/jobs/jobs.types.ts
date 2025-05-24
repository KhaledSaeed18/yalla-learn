export interface JobApplicationRef {
    id: string;
    jobId: string;
    applicantId: string;
    status: 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';
    createdAt: string;
    updatedAt: string;
}

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT';

export interface JobUser {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string;
    salary: string | null;
    type: JobType;
    status: JobStatus;
    postedBy: string;
    applicationUrl: string | null;
    deadline: string | null;
    createdAt: string;
    updatedAt: string;
    user: JobUser;
    applications?: JobApplicationRef[];
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface JobsQueryParams {
    page?: number;
    limit?: number;
    status?: JobStatus;
    type?: JobType;
    search?: string;
    sortBy?: 'title' | 'company' | 'createdAt' | 'deadline';
    sortOrder?: 'asc' | 'desc';
}

export interface GetJobsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        jobs: Job[];
        pagination: Pagination;
    };
}

export interface GetJobResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        job: Job;
    };
}

export interface CreateJobRequest {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string;
    salary?: string | null;
    type: JobType;
    status?: JobStatus;
    applicationUrl?: string | null;
    deadline?: string | null;
}

export interface CreateJobResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        job: Job;
    };
}

export interface UpdateJobRequest {
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    requirements?: string;
    salary?: string | null;
    type?: JobType;
    status?: JobStatus;
    applicationUrl?: string | null;
    deadline?: string | null;
}

export interface UpdateJobResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        job: Job;
    };
}

export interface DeleteJobResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface JobError {
    message: string;
    status?: number;
}

export interface JobStatisticsType {
    id: string;
    type: JobType;
    count: number;
}

export interface JobStatusStatistics {
    active: number;
    closed: number;
    draft: number;
}

export interface RecentJobStatistics {
    id: string;
    title: string;
    company: string;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
}

export interface PopularJobStatistics {
    id: string;
    title: string;
    company: string;
    applicationCount: number;
}

export interface JobStatistics {
    totalJobs: number;
    jobsByStatus: JobStatusStatistics;
    jobTypeDistribution: {
        type: JobType;
        count: number;
    }[];
    applications: {
        total: number;
        statusDistribution: {
            status: string;
            count: number;
        }[];
    };
    recentActivity: {
        lastWeekJobs: number;
        lastMonthJobs: number;
        recentJobs: {
            id: string;
            title: string;
            company: string;
            location: string;
            type: JobType;
            status: JobStatus;
            createdAt: string;
            _count: {
                applications: number;
            };
        }[];
    };
    popularJobs: {
        id: string;
        title: string;
        company: string;
        type: JobType;
        status: JobStatus;
        _count: {
            applications: number;
        };
    }[];
}

export interface GetJobStatisticsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        statistics: JobStatistics;
    };
}
