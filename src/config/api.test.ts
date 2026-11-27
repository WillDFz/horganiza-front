import { ApiService } from './api';
import axios from 'axios';

jest.mock('axios');

describe('ApiService', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    (ApiService as unknown as { axiosInstance: unknown }).axiosInstance = undefined;
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getInstance', () => {
    it('should create a new axios instance when none exists', () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
      };
      
      (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

      const instance = ApiService.getInstance();

      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:3001',
        withCredentials: true,
      });
      expect(instance).toBe(mockAxiosInstance);
    });

    it('should return existing instance when called multiple times', () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
      const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
      };
      
      (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

      const instance1 = ApiService.getInstance();
      const instance2 = ApiService.getInstance();

      expect(axios.create).toHaveBeenCalledTimes(1);
      expect(instance1).toBe(instance2);
      expect(instance1).toBe(mockAxiosInstance);
    });
  });
});

