import { api } from '@/lib/api/baseAPI';
import {
    GetSemestersResponse,
    GetSemesterResponse,
    CreateSemesterRequest,
    CreateSemesterResponse,
    UpdateSemesterRequest,
    UpdateSemesterResponse,
    DeleteSemesterResponse
} from '@/types/expense-tracker/expenseTracker.types';

export const semestersServices = {
    /**
     * Get all semesters
     * @returns A promise that resolves to the semesters response
     */
    getSemesters: () => {
        return api.get<GetSemestersResponse>(
            '/expense-tracker/get-semesters'
        );
    },

    /**
     * Get the active semester
     * @returns A promise that resolves to the active semester response
     */
    getActiveSemester: () => {
        return api.get<GetSemesterResponse>(
            '/expense-tracker/semesters/active'
        );
    },

    /**
     * Get a single semester by ID
     * @param id - The semester ID
     * @returns A promise that resolves to the semester response
     */
    getSemester: (id: string) => {
        return api.get<GetSemesterResponse>(
            `/expense-tracker/get-semester/${id}`
        );
    },

    /**
     * Create a new semester
     * @param semesterData - The semester data to create
     * @returns A promise that resolves to the created semester response
     */
    createSemester: (semesterData: CreateSemesterRequest) => {
        return api.post<CreateSemesterResponse>(
            '/expense-tracker/create-semester',
            semesterData
        );
    },

    /**
     * Update an existing semester
     * @param id - The semester ID to update
     * @param semesterData - The updated semester data
     * @returns A promise that resolves to the updated semester response
     */
    updateSemester: (id: string, semesterData: UpdateSemesterRequest) => {
        return api.put<UpdateSemesterResponse>(
            `/expense-tracker/update-semester/${id}`,
            semesterData
        );
    },

    /**
     * Delete a semester
     * @param id - The semester ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteSemester: (id: string) => {
        return api.delete<DeleteSemesterResponse>(
            `/expense-tracker/delete-semester/${id}`
        );
    }
};