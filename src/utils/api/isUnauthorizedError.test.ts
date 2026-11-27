import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';

import { isUnauthorizedError } from './isUnauthorizedError';

describe('isUnauthorizedError', () => {
    const mockResponse = (status: number, statusText: string): AxiosResponse => ({
        status,
        statusText,
        data: {},
        headers: {},
        config: { headers: new AxiosHeaders() },
    });

    it('returns true for 401 AxiosError', () => {
        const error = new AxiosError(undefined, '401', undefined, undefined, mockResponse(401, 'Unauthorized'));

        expect(isUnauthorizedError(error)).toBe(true);
    });

    it('returns true for 403 AxiosError', () => {
        const error = new AxiosError(undefined, '403', undefined, undefined, mockResponse(403, 'Forbidden'));

        expect(isUnauthorizedError(error)).toBe(true);
    });

    it('returns true for auth-related error messages', () => {
        expect(isUnauthorizedError(new Error('Sem token de autenticação'))).toBe(true);
    });

    it('returns false for other errors', () => {
        expect(isUnauthorizedError(new Error('Erro interno'))).toBe(false);
        expect(isUnauthorizedError(new AxiosError(undefined, '500', undefined, undefined, mockResponse(500, 'Internal Server Error')))).toBe(false);
    });
});
