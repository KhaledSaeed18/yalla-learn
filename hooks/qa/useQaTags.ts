import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { qaTagServices } from '@/services/qa/qaTags.services';
import { CreateTagRequest, QaTag } from '@/types/qa/qaTags.types';

// Query keys
export const qaTagKeys = {
    all: ['qaTags'] as const,
    lists: () => [...qaTagKeys.all, 'list'] as const,
    list: (filters: any) => [...qaTagKeys.lists(), { filters }] as const,
};

// Get all tags hook
export const useGetQaTags = () => {
    return useQuery({
        queryKey: qaTagKeys.lists(),
        queryFn: async () => {
            const response = await qaTagServices.getTags();
            return response.data.tags;
        },
    });
};

// Create tag hook (admin only)
export const useCreateQaTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (tagData: CreateTagRequest) =>
            qaTagServices.createTag(tagData),
        onSuccess: (response) => {
            queryClient.setQueryData<QaTag[]>(
                qaTagKeys.lists(),
                (oldData = []) => [...oldData, response.data.tag]
            );

            queryClient.invalidateQueries({
                queryKey: qaTagKeys.lists(),
            });

            toast.success("Tag created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create tag');
        },
    });
};

// Delete tag hook (admin only)
export const useDeleteQaTag = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => qaTagServices.deleteTag(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<QaTag[]>(
                qaTagKeys.lists(),
                (oldData = []) => oldData.filter((item) => item.id !== id)
            );

            toast.success('Tag deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete tag. Make sure the tag is not associated with any questions.');
        },
    });
};
