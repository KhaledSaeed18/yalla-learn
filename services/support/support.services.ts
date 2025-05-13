import { api } from '@/lib/api/baseAPI';
import {
    CreateContactFormRequest,
    CreateContactFormResponse,
    GetContactFormsResponse,
    GetContactFormResponse,
    DeleteContactFormResponse
} from '@/types/support/support.types';

export const supportServices = {
    /**
     * Submit a new contact form
     * @param formData - The contact form data to submit
     * @returns A promise that resolves to the created contact form response
     */
    createContactForm: (formData: CreateContactFormRequest) => {
        return api.post<CreateContactFormResponse>(
            '/contact/create',
            formData
        );
    },

    /**
     * Get all contact forms 
     * @returns A promise that resolves to the contact forms response
     */
    getContactForms: () => {
        return api.get<GetContactFormsResponse>(
            '/contact/get-all'
        );
    },

    /**
     * Get a single contact form by ID
     * @param id - The contact form ID
     * @returns A promise that resolves to the contact form response
     */
    getContactForm: (id: string) => {
        return api.get<GetContactFormResponse>(
            `/contact/get/${id}`
        );
    },

    /**
     * Delete a contact form
     * @param id - The contact form ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteContactForm: (id: string) => {
        return api.delete<DeleteContactFormResponse>(
            `/contact/delete/${id}`
        );
    }
};
