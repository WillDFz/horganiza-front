import { AxiosError } from 'axios';
import AuthService from './auth.service';
import { RegisterInfo } from '@/types/api/auth.types';
import { createMockBaseService, createMockAuthServiceLoginResponse, createMockRegisterResponse } from '@/utils/test';

jest.mock('../base.service');

describe('AuthService', () => {
  let authService: AuthService;
  let mockApi: {
    get: jest.Mock;
    post: jest.Mock;
  };

  beforeEach(() => {
    const { mockApi: api, setupService } = createMockBaseService(['get', 'post']);
    mockApi = api as { get: jest.Mock; post: jest.Mock };
    authService = setupService(AuthService) as AuthService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login response when status is 200', async () => {
      const mockResponse = createMockAuthServiceLoginResponse();

      mockApi.post.mockResolvedValue({
        status: 200,
        data: mockResponse,
      });

      const result = await authService.login('test@test.com', 'password123');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should surface API message on AxiosError', async () => {
      mockApi.post.mockRejectedValue(
        new AxiosError(undefined, '401', undefined, undefined, {
          status: 401,
          data: { message: 'Credenciais inválidas' },
          statusText: '',
          headers: {},
          config: { headers: {} } as never,
        }),
      );

      await expect(authService.login('test@test.com', 'wrong')).rejects.toThrow('Credenciais inválidas');
    });

    it('should throw Failed to login on non-Axios error', async () => {
      mockApi.post.mockRejectedValue(new Error('network'));

      await expect(authService.login('test@test.com', 'wrong')).rejects.toThrow('Failed to login');
    });
  });

  describe('logout', () => {
    it('should POST /auth/logout', async () => {
      mockApi.post.mockResolvedValue({ status: 204, data: undefined });

      await authService.logout();

      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should throw on failure', async () => {
      mockApi.post.mockRejectedValue(new Error('network'));

      await expect(authService.logout()).rejects.toThrow('Falha ao encerrar sessão');
    });
  });

  describe('getCurrentBusinessUser', () => {
    it('should return user from AuthMeResponse body of /auth/me', async () => {
      mockApi.get.mockResolvedValue({
        status: 200,
        data: {
          user: {
            id: 'u1',
            name: 'Test',
            email: 't@test.com',
            phone: '11999999999',
            role: 'USER' as const,
            business_id: 'b1',
            confirmed_email: false,
          },
        },
      });

      const result = await authService.getCurrentBusinessUser();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/me', { signal: undefined });
      expect(result).toEqual({
        id: 'u1',
        name: 'Test',
        email: 't@test.com',
        phone: '11999999999',
        role: 'USER',
        business_id: 'b1',
        confirmed_email: false,
      });
    });

    it('should throw when /auth/me body has no user field', async () => {
      mockApi.get.mockResolvedValue({
        status: 200,
        data: { id: 'u1', email: 't@test.com' },
      });

      await expect(authService.getCurrentBusinessUser()).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('register', () => {
    it('should return register response when status is 201', async () => {
      const registerInfo: RegisterInfo = {
        name: 'Test User',
        email: 'test@test.com',
        phone: '123456789',
        password: 'password123',
        confirmed_email: false,
      };

      const mockResponse = createMockRegisterResponse();

      mockApi.post.mockResolvedValue({
        status: 201,
        data: mockResponse,
      });

      const result = await authService.register(registerInfo);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', registerInfo);
      expect(result).toEqual(mockResponse);
    });

    it('should throw on register request failure', async () => {
      const registerInfo: RegisterInfo = {
        name: 'Test User',
        email: 'test@test.com',
        phone: '123456789',
        password: 'password123',
        confirmed_email: false,
      };

      mockApi.post.mockRejectedValue(new Error('network'));

      await expect(authService.register(registerInfo)).rejects.toThrow('Failed to register');
    });
  });

  describe('getCurrentCustomerUser', () => {
    it('returns customer from /auth/me-customer', async () => {
      const customer = {
        id: 'c1',
        name: 'C',
        email: 'c@test.com',
        phone: '1',
        role: 'CUSTOMER' as const,
        business_id: 'b1',
        confirmed_email: true,
      };
      mockApi.get.mockResolvedValue({ status: 200, data: { customer } });

      const result = await authService.getCurrentCustomerUser();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/me-customer', { signal: undefined });
      expect(result).toEqual(customer);
    });
  });

  describe('registerCustomer', () => {
    it('returns data on success', async () => {
      const payload = { email: 'a@b.com', business_id: 'b' };
      mockApi.post.mockResolvedValue({ data: payload });
      await expect(authService.registerCustomer(payload)).resolves.toEqual(payload);
      expect(mockApi.post).toHaveBeenCalledWith('/auth/register/customer', payload);
    });

    it('throws on non-axios error', async () => {
      mockApi.post.mockRejectedValue(new Error('network'));
      await expect(authService.registerCustomer({ email: '', business_id: '' })).rejects.toThrow(
        'Failed to register',
      );
    });
  });

  describe('loginCustomer', () => {
    it('returns boolean from body', async () => {
      mockApi.post.mockResolvedValue({ data: true });
      await expect(
        authService.loginCustomer({
          email: 'a@b.com',
          url: 'x',
          confirmation_code: '123456',
        }),
      ).resolves.toBe(true);
    });

    it('throws Failed to login on generic error', async () => {
      mockApi.post.mockRejectedValue(new Error('x'));
      await expect(
        authService.loginCustomer({
          email: 'a@b.com',
          url: 'x',
          confirmation_code: '123456',
        }),
      ).rejects.toThrow('Failed to login');
    });
  });

  describe('requestConfirmationCode', () => {
    it('defaults success to true when omitted', async () => {
      mockApi.post.mockResolvedValue({ data: {} });
      await expect(authService.requestConfirmationCode('a@b.com', 'slug')).resolves.toBe(true);
    });

    it('rethrows non-axios errors', async () => {
      mockApi.post.mockRejectedValue(new Error('network'));
      await expect(authService.requestConfirmationCode('a@b.com', 'slug')).rejects.toThrow('network');
    });
  });

  describe('verifyCode', () => {
    it('returns success flag', async () => {
      mockApi.post.mockResolvedValue({ data: { success: false } });
      await expect(
        authService.verifyCode({
          email: 'a@b.com',
          url: 'x',
          confirmation_code: '1',
        }),
      ).resolves.toBe(false);
    });

    it('throws Failed to verify on generic error', async () => {
      mockApi.post.mockRejectedValue(new Error('x'));
      await expect(
        authService.verifyCode({
          email: 'a@b.com',
          url: 'x',
          confirmation_code: '1',
        }),
      ).rejects.toThrow('Failed to verify code');
    });
  });

  describe('confirmEmail', () => {
    it('should return confirmation response when status is 201', async () => {
      const mockResponse = { id: '1' };

      mockApi.post.mockResolvedValue({
        status: 201,
        data: mockResponse,
      });

      const result = await authService.confirmEmail('1');

      expect(mockApi.post).toHaveBeenCalledWith('/email_confirmations', { id: '1' });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when status is not 201', async () => {
      mockApi.post.mockResolvedValue({
        status: 400,
        data: {},
      });

      await expect(authService.confirmEmail('1')).rejects.toThrow('Failed to confirm email');
    });
  });
});

