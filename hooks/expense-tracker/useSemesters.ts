import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterServices } from '@/services/expense-tracker/semesters.services';
import {
    Semester,
    CreateSemesterRequest,
    UpdateSemesterRequest
} from '@/types/expense-tracker/expenseTracker.types';
import { toast } from 'sonner';

// Query keys
export const semesterKeys = {
    all: ['semesters'] as const,
    lists: () => [...semesterKeys.all, 'list'] as const,
    active: () => [...semesterKeys.all, 'active'] as const,
    details: () => [...semesterKeys.all, 'detail'] as const,
    detail: (id: string) => [...semesterKeys.details(), id] as const,
};

// Get all semesters hook
export const useGetSemesters = () => {
    return useQuery({
        queryKey: semesterKeys.lists(),
        queryFn: async () => {
            const response = await semesterServices.getSemesters();
            return response.data.semesters;
        },
    });
};

// Get active semester hook
export const useGetActiveSemester = () => {
    return useQuery({
        queryKey: semesterKeys.active(),
        queryFn: async () => {
            const response = await semesterServices.getActiveSemester();
            return response.data.semester;
        },
    });
};

// Get single semester hook
export const useGetSemester = (id: string) => {
    return useQuery({
        queryKey: semesterKeys.detail(id),
        queryFn: async () => {
            const response = await semesterServices.getSemesterById(id);
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
            semesterServices.createSemester(semesterData),
        onSuccess: (response) => {
            // Update semesters list
            queryClient.setQueryData<Semester[]>(
                semesterKeys.lists(),
                (oldData = []) => [...oldData, response.data.semester]
            );

            // If the new semester is active, update the active semester data
            if (response.data.semester.isActive) {
                queryClient.setQueryData(
                    semesterKeys.active(),
                    response.data.semester
                );
            }

            // Invalidate related queries
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
            semesterServices.updateSemester(id, semesterData),
        onSuccess: (response, { id }) => {
            // Update semester detail
            queryClient.setQueryData(
                semesterKeys.detail(id),
                response.data.semester
            );

            // Update semester in lists
            queryClient.setQueryData<Semester[]>(
                semesterKeys.lists(),
                (oldData = []) =>
                    oldData.map((item) =>
                        item.id === id ? response.data.semester : item
                    )
            );

            // If this semester is set to active, update the active semester data
            if (response.data.semester.isActive) {
                queryClient.setQueryData(
                    semesterKeys.active(),
                    response.data.semester
                );
            }

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
        mutationFn: (id: string) => semesterServices.deleteSemester(id),
        onSuccess: (_, id) => {
            // Remove from semester lists
            queryClient.setQueryData<Semester[]>(
                semesterKeys.lists(),
                (oldData = []) => oldData.filter((item) => item.id !== id)
            );

            // Remove specific semester data
            queryClient.removeQueries({
                queryKey: semesterKeys.detail(id),
            });

            // Invalidate active semester query since it might have changed
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
