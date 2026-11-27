'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth/auth.service';
import {
    CustomerLoginCredentials,
    CustomerRegisterInfo,
    RegisterInfo,
    RegisterResponse,
    UserSession,
} from '@/types/api/auth.types';
import { toast } from 'react-toastify';

export type AuthContextValue = {
    user: UserSession | null;
    loading: boolean;
    sessionChecking: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<UserSession>;
    register: (registerInfo: RegisterInfo) => Promise<RegisterResponse | null>;
    customerLogin: (credentials: CustomerLoginCredentials) => Promise<UserSession>;
    customerRegister: (registerInfo: CustomerRegisterInfo) => Promise<CustomerRegisterInfo>;
    logout: (redirectTo?: string) => Promise<void>;
    refreshBusinessSession: () => Promise<void>;
    refreshCustomerSession: () => Promise<void>;
    getUserSession: () => Promise<UserSession | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const authService = useMemo(() => new AuthService(), []);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [sessionChecking, setSessionChecking] = useState(true);
    const [user, setUser] = useState<UserSession | null>(null);

    const isAuthenticated = useMemo(() => user !== null, [user]);

    const refreshBusinessSession = useCallback(async () => {
        setSessionChecking(true);
        try {
            const data = await authService.getCurrentBusinessUser();
            setUser(data);
        } catch (error) {
            const status = error instanceof AxiosError ? error.response?.status : undefined;
            if (status !== undefined && status !== 401 && status !== 403) {
                toast.error('Não foi possível verificar a sessão. Tente novamente.');
            }
            setUser(null);
        } finally {
            setSessionChecking(false);
        }
    }, [authService]);

    const refreshCustomerSession = useCallback(async () => {
        setSessionChecking(true);
        try {
            const data = await authService.getCurrentCustomerUser();
            setUser(data);
        } catch (error) {
            const status = error instanceof AxiosError ? error.response?.status : undefined;
            if (status !== undefined && status !== 401 && status !== 403) {
                toast.error('Não foi possível verificar a sessão. Tente novamente.');
            }
            setUser(null);
        } finally {
            setSessionChecking(false);
        }
    }, [authService]);


    const register = useCallback(
        async (registerInfo: RegisterInfo): Promise<RegisterResponse | null> => {
            setLoading(true);
            try {
                const data = await authService.register(registerInfo);
                if (!data) {
                    throw new Error('Failed to register');
                }
                try {
                    const me = await authService.getCurrentBusinessUser();
                    setUser(me);
                } catch {
                    // Cookie pode não estar presente conforme política da API; estado segue só com /me em sucesso.
                }
                return data;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                toast.error(errorMessage);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [authService],
    );

    const login = useCallback(
        async (email: string, password: string): Promise<UserSession> => {
            setLoading(true);
            try {
                await authService.login(email, password);
                const session = await authService.getCurrentBusinessUser();
                setUser(session);
                return session;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
                toast.error(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [authService],
    );

    const logout = useCallback(async (redirectTo?: string) => {
        const destination = redirectTo ?? '/auth/login';
        try {
            await authService.logout();
        } catch {
            toast.error('Não foi possível encerrar a sessão no servidor.');
        } finally {
            setUser(null);
            router.push(destination);
        }
    }, [authService, router]);

    const customerRegister = useCallback(async (registerInfo: CustomerRegisterInfo): Promise<CustomerRegisterInfo> => {
        setLoading(true);
        try {
            const data = await authService.registerCustomer(registerInfo);
            toast.success('Cliente cadastrado com sucesso');
            return data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar cliente';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [authService]);

    const customerLogin = useCallback(async (credentials: CustomerLoginCredentials): Promise<UserSession> => {
        setLoading(true);
        try {
            await authService.loginCustomer(credentials);
            const session = await authService.getCurrentCustomerUser();
            setUser(session);
            return session;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login como cliente';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [authService]);


    const getUserSession = useCallback(async (): Promise<UserSession | null> => user, [user]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            sessionChecking,
            isAuthenticated,
            login,
            register,
            customerLogin,
            customerRegister,
            logout,
            refreshBusinessSession,
            refreshCustomerSession,
            getUserSession,
        }),
        [
            user,
            loading,
            sessionChecking,
            isAuthenticated,
            login,
            register,
            customerLogin,
            customerRegister,
            logout,
            refreshBusinessSession,
            refreshCustomerSession,
            getUserSession,
        ],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return ctx;
}
