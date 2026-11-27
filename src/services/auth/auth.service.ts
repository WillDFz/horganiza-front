import { AxiosError } from 'axios';
import { BaseService } from '../base.service';
import {
    AuthMeCustomerResponse,
    AuthMeResponse,
    CustomerLoginCredentials,
    CustomerRegisterInfo,
    CustomerSession,
    LoginResponse,
    RegisterInfo,
    RegisterResponse,
    UserSession,
} from '@/types/api/auth.types';

export default class AuthService extends BaseService {
    constructor() {
        super();
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await this.api.post<LoginResponse>('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to login');
        }
    }

    async logout(): Promise<void> {
        try {
            await this.api.post('/auth/logout');
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(
                    (error.response?.data as { message?: string })?.message ?? 'Falha ao encerrar sessão',
                );
            }
            throw new Error('Falha ao encerrar sessão');
        }
    }

    async getCurrentBusinessUser(signal?: AbortSignal): Promise<UserSession> {
        const response = await this.api.get<AuthMeResponse>('/auth/me', { signal });

        const user = response.data.user;
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    }

    async getCurrentCustomerUser(signal?: AbortSignal): Promise<CustomerSession> {
        const response = await this.api.get<AuthMeCustomerResponse>('/auth/me-customer', { signal });

        const customer = response.data.customer;
        return customer;
    }

    async register(registerInfo: RegisterInfo): Promise<RegisterResponse> {
        try {
            const response = await this.api.post('/auth/register', registerInfo);

            return response.data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to register');
        }
    }

    async registerCustomer(registerInfo: CustomerRegisterInfo): Promise<CustomerRegisterInfo> {
        try {
            const response = await this.api.post<CustomerRegisterInfo>('/auth/register/customer', registerInfo);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
        }
        throw new Error('Failed to register');
    }


    async loginCustomer(credentials: CustomerLoginCredentials): Promise<boolean> {
        try {
            const response = await this.api.post('/auth/login/customer', credentials);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
        }
        throw new Error('Failed to login');
    }

    async requestConfirmationCode(email: string, url: string): Promise<boolean> {
        try {
            const response = await this.api.post<{ success?: boolean }>('/auth/request-code', { email, url });
            return response.data.success ?? true;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw error;
        }
    }

    async verifyCode(credentials: CustomerLoginCredentials): Promise<boolean> {
        try {
            const response = await this.api.post<{ success?: boolean }>('/auth/verify-code', credentials);
            return response.data.success ?? true;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
        }
        throw new Error('Failed to verify code');
    }


    async confirmEmail(id: string): Promise<{ id: string }> {
        const response = await this.api.post(`/email_confirmations`, { id });
        if (response.status !== 201) {
            throw new Error('Failed to confirm email');
        }
        return response.data;
    }
}
