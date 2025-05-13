import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportServices } from '@/services/support/support.services';
import { ContactForm, CreateContactFormRequest } from '@/types/support/support.types';
import { toast } from 'sonner';

// Query keys
export const supportKeys = {
    all: ['support'] as const,
    lists: () => [...supportKeys.all, 'list'] as const,
    details: () => [...supportKeys.all, 'detail'] as const,
    detail: (id: string) => [...supportKeys.details(), id] as const,
};

// Submit contact form hook
export const useCreateContactForm = () => {
    return useMutation({
        mutationFn: (formData: CreateContactFormRequest) =>
            supportServices.createContactForm(formData),
        onSuccess: () => {
            toast.success('Your message has been sent successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to send your message');
        },
    });
};

// Get all contact forms hook - for admin use
export const useGetContactForms = () => {
    return useQuery({
        queryKey: supportKeys.lists(),
        queryFn: async () => {
            const response = await supportServices.getContactForms();
            return response.data;
        },
    });
};

// Get single contact form hook by ID
export const useGetContactForm = (id: string) => {
    return useQuery({
        queryKey: supportKeys.detail(id),
        queryFn: async () => {
            const response = await supportServices.getContactForm(id);
            return response.data;
        },
        enabled: !!id,
    });
};

// Delete contact form hook
export const useDeleteContactForm = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => supportServices.deleteContactForm(id),
        onSuccess: (_, id) => {
            queryClient.getQueriesData({ queryKey: supportKeys.lists() }).forEach(([queryKey, queryData]) => {
                if (queryData && typeof queryData === 'object' && Array.isArray(queryData)) {
                    const typedData = queryData as ContactForm[];

                    queryClient.setQueryData(queryKey,
                        typedData.filter((form: ContactForm) => form.id !== id)
                    );
                }
            });

            queryClient.removeQueries({
                queryKey: supportKeys.detail(id),
            });

            toast.success('Contact form deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete contact form');
        },
    });
};
