import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { semestersServices } from '@/services/expense-tracker/semesters.services';
import {
    CreateSemesterRequest,
    UpdateSemesterRequest,
    Semester
} from '@/types/expense-tracker/expenseTracker.types';

// Query keys
export const semesterKeys = {
    all: ['semesters'] as const,
    lists: () => [...semesterKeys.all, 'list'] as const,
    list: () => [...semesterKeys.lists()] as const,
    details: () => [...semesterKeys.all, 'detail'] as const,
    detail: (id: string) => [...semesterKeys.details(), id] as const,
    active: () => [...semesterKeys.all, 'active'] as const,
};

// Get all semesters hook
export const useGetSemesters = () => {
    return useQuery({
        queryKey: semesterKeys.list(),
        queryFn: async () => {
            const response = await semestersServices.getSemesters();
            return response.data.semesters;
        },
    });
};

// Get active semester hook
export const useGetActiveSemester = () => {
    return useQuery({
        queryKey: semesterKeys.active(),
        queryFn: async () => {
            const response = await semestersServices.getActiveSemester();
            return response.data.semester;
        },
    });
};

// Get single semester hook by ID
export const useGetSemester = (id: string) => {
    return useQuery({
        queryKey: semesterKeys.detail(id),
        queryFn: async () => {
            const response = await semestersServices.getSemester(id);
            return response.data.semester;
        },
        enabled: !!id,
    });
};

// Create semester hook
export const useCreateSemester = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (semesterData: CreateSemesterRequest) =>
            semestersServices.createSemester(semesterData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: semesterKeys.lists(),
            });

            toast.success("Semester created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create semester');
        },
    });
};

// Update semester hook
export const useUpdateSemester = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, semesterData }: { id: string; semesterData: UpdateSemesterRequest }) =>
            semestersServices.updateSemester(id, semesterData),
        onSuccess: (response, { id }) => {
            queryClient.invalidateQueries({
                queryKey: semesterKeys.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: semesterKeys.lists(),
            });

            queryClient.invalidateQueries({
                queryKey: semesterKeys.active(),
            });

            toast.success('Semester updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update semester');
        },
    });
};

// Delete semester hook
export const useDeleteSemester = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => semestersServices.deleteSemester(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: semesterKeys.lists(),
            });

            queryClient.removeQueries({
                queryKey: semesterKeys.detail(id),
            });

            queryClient.invalidateQueries({
                queryKey: semesterKeys.active(),
            });

            toast.success('Semester deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete semester');
        },
    });
};