import { renderHook, act, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import AuthService from '@/services/auth/auth.service';
import { toast } from 'react-toastify';
import {
  createMockAuthServiceLoginResponse,
  createMockRegisterResponse,
  createMockCustomerSession,
  createMockUserSession,
} from '@/utils/test';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/auth/auth.service');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(AuthProvider, null, children);

function axiosErrorWithStatus(status: number): AxiosError {
  return new AxiosError(undefined, String(status), undefined, undefined, {
    status,
    data: {},
    statusText: '',
    headers: {},
    config: { headers: {} } as never,
  });
}

describe('AuthProvider / useAuth', () => {
  const mockPush = jest.fn();
  let mockAuthService: jest.Mocked<
    Pick<
      AuthService,
      | 'login'
      | 'logout'
      | 'register'
      | 'getCurrentBusinessUser'
      | 'getCurrentCustomerUser'
      | 'loginCustomer'
      | 'registerCustomer'
    >
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: jest.fn() });

    mockAuthService = {
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      getCurrentBusinessUser: jest.fn(),
      getCurrentCustomerUser: jest.fn(),
      loginCustomer: jest.fn(),
      registerCustomer: jest.fn(),
    };

    (AuthService as jest.Mock).mockImplementation(() => mockAuthService);
  });

  it('should set isAuthenticated when refreshBusinessSession /auth/me succeeds', async () => {
    const session = createMockUserSession();
    mockAuthService.getCurrentBusinessUser.mockResolvedValue(session);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshBusinessSession();
    });

    expect(result.current.sessionChecking).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(session);
    expect(mockAuthService.getCurrentBusinessUser).toHaveBeenCalled();
  });

  it('should set isAuthenticated false when refreshBusinessSession fails with 401', async () => {
    mockAuthService.getCurrentBusinessUser.mockRejectedValue(axiosErrorWithStatus(401));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshBusinessSession();
    });

    expect(result.current.sessionChecking).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should login and set user from /auth/me after cookie session', async () => {
    const session = createMockUserSession();
    mockAuthService.getCurrentBusinessUser
      .mockRejectedValueOnce(axiosErrorWithStatus(401))
      .mockResolvedValueOnce(session);

    const loginUser = createMockAuthServiceLoginResponse();
    mockAuthService.login.mockResolvedValue(loginUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshBusinessSession();
    });

    await act(async () => {
      await result.current.login('test@test.com', 'password123');
    });

    expect(mockAuthService.login).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(mockAuthService.getCurrentBusinessUser).toHaveBeenCalledTimes(2);
    expect(result.current.user).toEqual(session);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login error', async () => {
    mockAuthService.getCurrentBusinessUser.mockRejectedValue(axiosErrorWithStatus(401));

    const error = new Error('Invalid credentials');
    mockAuthService.login.mockRejectedValue(error);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshBusinessSession();
    });

    await act(async () => {
      await expect(result.current.login('test@test.com', 'wrong')).rejects.toThrow();
    });

    expect(toast.error).toHaveBeenCalled();
  });

  it('should register successfully and hydrate user from /auth/me', async () => {
    const session = createMockUserSession();
    mockAuthService.getCurrentBusinessUser
      .mockRejectedValueOnce(axiosErrorWithStatus(401))
      .mockResolvedValueOnce(session);

    const registerInfo = {
      name: 'Test User',
      email: 'test@test.com',
      phone: '123456789',
      password: 'password123',
      confirmed_email: false,
    };

    const mockRegisterResponse = createMockRegisterResponse();
    mockAuthService.register.mockResolvedValue(mockRegisterResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshBusinessSession();
    });

    await act(async () => {
      await result.current.register(registerInfo);
    });

    expect(mockAuthService.register).toHaveBeenCalledWith(registerInfo);
    expect(mockAuthService.getCurrentBusinessUser).toHaveBeenCalledTimes(2);
    expect(result.current.user).toEqual(session);
  });

  it('should logout, call API and clear user', async () => {
    const session = createMockUserSession();
    mockAuthService.getCurrentBusinessUser.mockResolvedValue(session);
    mockAuthService.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshBusinessSession();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('getUserSession should return mapped user when authenticated', async () => {
    const session = createMockUserSession();
    mockAuthService.getCurrentBusinessUser.mockResolvedValue(session);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshBusinessSession();
    });

    let resolved: Awaited<ReturnType<typeof result.current.getUserSession>> | undefined;
    await act(async () => {
      resolved = await result.current.getUserSession();
    });

    expect(resolved).toEqual(session);
  });

  it('should set user when refreshCustomerSession succeeds', async () => {
    const session = createMockCustomerSession();
    mockAuthService.getCurrentCustomerUser.mockResolvedValue(session);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshCustomerSession();
    });

    expect(result.current.user).toEqual(session);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should clear user when refreshCustomerSession fails with 401', async () => {
    mockAuthService.getCurrentCustomerUser.mockRejectedValue(axiosErrorWithStatus(401));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.refreshCustomerSession();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should customerLogin and set customer session', async () => {
    const session = createMockCustomerSession();
    mockAuthService.loginCustomer.mockResolvedValue(true);
    mockAuthService.getCurrentCustomerUser.mockResolvedValue(session);

    const { result } = renderHook(() => useAuth(), { wrapper });

    const credentials = {
      email: 'c@test.com',
      url: 'loja',
      confirmation_code: '123456',
    };

    await act(async () => {
      await result.current.customerLogin(credentials);
    });

    expect(mockAuthService.loginCustomer).toHaveBeenCalledWith(credentials);
    expect(result.current.user).toEqual(session);
  });

  it('should customerRegister successfully', async () => {
    const payload = { email: 'c@test.com', business_id: 'b1' };
    mockAuthService.registerCustomer.mockResolvedValue(payload);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response: typeof payload | undefined;
    await act(async () => {
      response = await result.current.customerRegister(payload);
    });

    expect(mockAuthService.registerCustomer).toHaveBeenCalledWith(payload);
    expect(response).toEqual(payload);
    expect(toast.success).toHaveBeenCalled();
  });

  it('should logout with custom redirect', async () => {
    mockAuthService.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout('/business/loja/auth/login');
    });

    expect(mockPush).toHaveBeenCalledWith('/business/loja/auth/login');
    expect(result.current.user).toBeNull();
  });

  it('should throw when useAuth is used outside AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth deve ser usado dentro de AuthProvider',
    );

    consoleError.mockRestore();
  });
});
