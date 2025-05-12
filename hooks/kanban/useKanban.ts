import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kanbanServices } from '@/services/kanban/kanban.services';
import {
    KanbanBoard,
    CreateBoardRequest,
    CreateColumnRequest,
    CreateTaskRequest,
} from '@/types/kanban/kanban.types';
import { toast } from 'sonner';

// Query keys
export const kanbanKeys = {
    all: ['kanban'] as const,
    boards: () => [...kanbanKeys.all, 'boards'] as const,
    board: (id: string) => [...kanbanKeys.boards(), id] as const,
    columns: (boardId: string) => [...kanbanKeys.board(boardId), 'columns'] as const,
    column: (columnId: string) => [...kanbanKeys.all, 'columns', columnId] as const,
    tasks: (columnId: string) => [...kanbanKeys.column(columnId), 'tasks'] as const,
    task: (id: string) => [...kanbanKeys.all, 'tasks', id] as const,
};

// Get all boards hook
export const useGetBoards = () => {
    return useQuery({
        queryKey: kanbanKeys.boards(),
        queryFn: async () => {
            const response = await kanbanServices.getBoards();
            return response.data.boards;
        },
    });
};

// Get single board hook
export const useGetBoard = (id: string) => {
    return useQuery({
        queryKey: kanbanKeys.board(id),
        queryFn: async () => {
            const response = await kanbanServices.getBoard(id);
            return response.data.board;
        },
        enabled: !!id,
    });
};

// Create board hook
export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (boardData: CreateBoardRequest) =>
            kanbanServices.createBoard(boardData),
        onSuccess: (response) => {
            queryClient.setQueryData<KanbanBoard[]>(
                kanbanKeys.boards(),
                (oldData = []) => [...oldData, response.data.board]
            );

            toast.success("Board created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create board');
        },
    });
};

// Delete board hook
export const useDeleteBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => kanbanServices.deleteBoard(id),
        onSuccess: (_, id) => {
            queryClient.setQueryData<KanbanBoard[]>(
                kanbanKeys.boards(),
                (oldData = []) => oldData.filter((board) => board.id !== id)
            );

            queryClient.removeQueries({
                queryKey: kanbanKeys.board(id),
            });

            toast.success('Board deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete board');
        },
    });
};

// Create column hook
export const useCreateColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ boardId, columnData }: { boardId: string; columnData: CreateColumnRequest }) =>
            kanbanServices.createColumn(boardId, columnData),
        onSuccess: (response, { boardId }) => {
            queryClient.setQueryData<KanbanBoard>(
                kanbanKeys.board(boardId),
                (oldData) => {
                    if (!oldData) return oldData;

                    // Ensure new column has tasks array initialized
                    const newColumn = {
                        ...response.data.column,
                        tasks: response.data.column.tasks || []
                    };

                    return {
                        ...oldData,
                        columns: [...oldData.columns, newColumn]
                    };
                }
            );

            toast.success("Column created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create column');
        },
    });
};

// Delete column hook
export const useDeleteColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ columnId, boardId }: { columnId: string; boardId: string }) =>
            kanbanServices.deleteColumn(columnId),
        onSuccess: (_, { columnId, boardId }) => {
            queryClient.setQueryData<KanbanBoard>(
                kanbanKeys.board(boardId),
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        columns: oldData.columns.filter(column => column.id !== columnId)
                    };
                }
            );

            toast.success('Column deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete column');
        },
    });
};

// Get task hook
export const useGetTask = (id: string) => {
    return useQuery({
        queryKey: kanbanKeys.task(id),
        queryFn: async () => {
            const response = await kanbanServices.getTask(id);
            return response.data.task;
        },
        enabled: !!id,
    });
};

// Create task hook
export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ columnId, taskData, boardId }: { columnId: string; taskData: CreateTaskRequest; boardId: string }) =>
            kanbanServices.createTask(columnId, taskData),
        onSuccess: (response, { columnId, boardId }) => {
            queryClient.setQueryData<KanbanBoard>(
                kanbanKeys.board(boardId),
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        columns: oldData.columns.map(column => {
                            if (column.id === columnId) {
                                return {
                                    ...column,
                                    tasks: [...(column.tasks || []), response.data.task]
                                };
                            }
                            return column;
                        })
                    };
                }
            );

            toast.success("Task created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create task');
        },
    });
};

// Delete task hook
export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, boardId }: { id: string; boardId: string }) =>
            kanbanServices.deleteTask(id),
        onSuccess: (_, { id, boardId }) => {
            queryClient.removeQueries({
                queryKey: kanbanKeys.task(id),
            });

            queryClient.setQueryData<KanbanBoard>(
                kanbanKeys.board(boardId),
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        columns: oldData.columns.map(column => {
                            return {
                                ...column,
                                tasks: (column.tasks || []).filter(task => task.id !== id)
                            };
                        })
                    };
                }
            );

            toast.success('Task deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete task');
        },
    });
};
