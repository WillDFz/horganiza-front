import { AxiosError } from 'axios';

const AUTH_ERROR_MESSAGE_PATTERN = /sem token|n[aã]o autenticad|unauthorized/i;

export function isUnauthorizedError(error: unknown): boolean {
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            return true;
        }
    }

    if (error instanceof Error && AUTH_ERROR_MESSAGE_PATTERN.test(error.message)) {
        return true;
    }

    return false;
}
