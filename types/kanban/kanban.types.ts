// Types for Kanban board feature
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface KanbanTask {
    id: string;
    title: string;
    description: string | null;
    priority: TaskPriority;
    dueDate: string | null;
    columnId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface KanbanColumn {
    id: string;
    title: string;
    boardId: string;
    isDefault: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
    tasks: KanbanTask[];
}

export interface KanbanBoard {
    id: string;
    title: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    columns: KanbanColumn[];
}

// API Request/Response types
export interface CreateBoardRequest {
    title: string;
}

export interface CreateBoardResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        board: KanbanBoard;
    };
}

export interface GetBoardsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        boards: KanbanBoard[];
    };
}

export interface GetBoardResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        board: KanbanBoard;
    };
}

export interface DeleteBoardResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface CreateColumnRequest {
    title: string;
    isDefault?: boolean;
    order?: number;
}

export interface CreateColumnResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        column: KanbanColumn;
    };
}

export interface DeleteColumnResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string | null;
    priority: TaskPriority;
    dueDate?: string | null;
}

export interface CreateTaskResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        task: KanbanTask;
    };
}

export interface GetTaskResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        task: KanbanTask;
    };
}

export interface DeleteTaskResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface KanbanError {
    message: string;
    status?: number;
}
