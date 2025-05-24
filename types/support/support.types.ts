export interface ContactForm {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactFormRequest {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface CreateContactFormResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        id: string;
    };
}

export interface GetContactFormsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: ContactForm[];
}

export interface GetContactFormResponse {
    status: string;
    statusCode: number;
    message: string;
    data: ContactForm;
}

export interface DeleteContactFormResponse {
    status: string;
    statusCode: number;
    message: string;
}

export interface ContactFormError {
    message: string;
    status?: number;
}
