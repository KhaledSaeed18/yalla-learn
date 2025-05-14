import { api } from '@/lib/api/baseAPI';
import {
    GetTagsResponse,
    GetTagResponse,
    CreateTagRequest,
    CreateTagResponse,
    DeleteTagResponse
} from '@/types/qa/qaTags.types';

export const qaTagServices = {
    /**
     * Get all Q&A tags
     * @returns A promise that resolves to the tags response
     */
    getTags: () => {
        return api.get<GetTagsResponse>(
            '/qa/tags'
        );
    },

    /**
     * Create a new Q&A tag (admin only)
     * @param tagData - The tag data to create
     * @returns A promise that resolves to the created tag response
     */
    createTag: (tagData: CreateTagRequest) => {
        return api.post<CreateTagResponse>(
            '/qa/tags',
            tagData
        );
    },

    /**
     * Delete a Q&A tag (admin only)
     * @param id - The tag ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteTag: (id: string) => {
        return api.delete<DeleteTagResponse>(
            `/qa/tags/${id}`
        );
    }
};
