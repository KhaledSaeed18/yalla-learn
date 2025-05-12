import { api } from '@/lib/api/baseAPI';
import {
    CreateBoardRequest,
    CreateBoardResponse,
    GetBoardsResponse,
    GetBoardResponse,
    DeleteBoardResponse,
    CreateColumnRequest,
    CreateColumnResponse,
    DeleteColumnResponse,
    CreateTaskRequest,
    CreateTaskResponse,
    GetTaskResponse,
    UpdateTaskRequest,
    UpdateTaskResponse,
    DeleteTaskResponse
} from '@/types/kanban/kanban.types';

export const kanbanServices = {
    /**
     * Create a new kanban board
     * @param boardData - The board data to create
     * @returns A promise that resolves to the created board response
     */
    createBoard: (boardData: CreateBoardRequest) => {
        return api.post<CreateBoardResponse>(
            '/kanban/create-board',
            boardData
        );
    },

    /**
     * Get all kanban boards belonging to the authenticated user
     * @returns A promise that resolves to the boards response
     */
    getBoards: () => {
        return api.get<GetBoardsResponse>(
            '/kanban/get-boards'
        );
    },

    /**
     * Get a single kanban board by ID
     * @param id - The board ID
     * @returns A promise that resolves to the board response
     */
    getBoard: (id: string) => {
        return api.get<GetBoardResponse>(
            `/kanban/get-board/${id}`
        );
    },

    /**
     * Delete a kanban board
     * @param id - The board ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteBoard: (id: string) => {
        return api.delete<DeleteBoardResponse>(
            `/kanban/delete-board/${id}`
        );
    },

    /**
     * Create a new column in a board
     * @param boardId - The board ID to create the column in
     * @param columnData - The column data to create
     * @returns A promise that resolves to the created column response
     */
    createColumn: (boardId: string, columnData: CreateColumnRequest) => {
        return api.post<CreateColumnResponse>(
            `/kanban/boards/${boardId}/create-column`,
            columnData
        );
    },

    /**
     * Delete a column
     * @param id - The column ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteColumn: (id: string) => {
        return api.delete<DeleteColumnResponse>(
            `/kanban/delete-column/${id}`
        );
    },

    /**
     * Create a new task in a column
     * @param columnId - The column ID to create the task in
     * @param taskData - The task data to create
     * @returns A promise that resolves to the created task response
     */
    createTask: (columnId: string, taskData: CreateTaskRequest) => {
        return api.post<CreateTaskResponse>(
            `/kanban/column/${columnId}/create-task`,
            taskData
        );
    },

    /**
     * Get a task by ID
     * @param id - The task ID
     * @returns A promise that resolves to the task response
     */
    getTask: (id: string) => {
        return api.get<GetTaskResponse>(
            `/kanban/get-task/${id}`
        );
    },

    /**
     * Update a task
     * @param id - The task ID to update
     * @param taskData - The updated task data
     * @returns A promise that resolves to the updated task response
     */
    updateTask: (id: string, taskData: UpdateTaskRequest) => {
        return api.put<UpdateTaskResponse>(
            `/kanban/update-task/${id}`,
            taskData
        );
    },

    /**
     * Delete a task
     * @param id - The task ID to delete
     * @returns A promise that resolves to the delete response
     */
    deleteTask: (id: string) => {
        return api.delete<DeleteTaskResponse>(
            `/kanban/delete-task/${id}`
        );
    }
};
