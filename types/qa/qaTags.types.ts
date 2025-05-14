export interface QaTag {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    questionCount?: number;
}

export interface GetTagsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        tags: QaTag[];
    };
}

export interface GetTagResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        tag: QaTag;
    };
}

export interface CreateTagRequest {
    name: string;
}

export interface CreateTagResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        tag: QaTag;
    };
}

export interface DeleteTagResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface TagError {
    message: string;
    status?: number;
}
