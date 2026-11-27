import { renderHook, act } from '@testing-library/react';
import { useBusiness } from './index';
import BusinessService from '@/services/business/business.service';
import { toast } from 'react-toastify';
import { createMockBusiness } from '@/utils/test';

jest.mock('@/services/business/business.service');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('useBusiness', () => {
  let mockBusinessService: jest.Mocked<BusinessService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBusinessService = {
      getBusiness: jest.fn(),
      getBusinessBySlug: jest.fn(),
      updateBusiness: jest.fn(),
    } as unknown as jest.Mocked<BusinessService>;
    (BusinessService as jest.Mock).mockImplementation(() => mockBusinessService);
  });

  it('fetches business and updates state', async () => {
    const mockBusiness = createMockBusiness();
    mockBusinessService.getBusiness.mockResolvedValue(mockBusiness);
    const { result } = renderHook(() => useBusiness());

    await act(async () => {
      await result.current.getBusiness();
    });

    expect(mockBusinessService.getBusiness).toHaveBeenCalled();
    expect(result.current.business).toEqual(mockBusiness);
    expect(result.current.loading).toBe(false);
  });

  it('fetches business by slug', async () => {
    const mockBusiness = createMockBusiness();
    mockBusinessService.getBusinessBySlug.mockResolvedValue(mockBusiness);
    const { result } = renderHook(() => useBusiness());

    await act(async () => {
      const data = await result.current.getBusinessBySlug('my-business');
      expect(data).toEqual(mockBusiness);
    });

    expect(mockBusinessService.getBusinessBySlug).toHaveBeenCalledWith('my-business');
  });

  it('updates business', async () => {
    const mockBusiness = createMockBusiness();
    mockBusinessService.updateBusiness.mockResolvedValue(mockBusiness);
    const { result } = renderHook(() => useBusiness());

    await act(async () => {
      const data = await result.current.updateBusiness(mockBusiness);
      expect(data).toEqual(mockBusiness);
    });

    expect(mockBusinessService.updateBusiness).toHaveBeenCalledWith(mockBusiness);
    expect(result.current.business).toEqual(mockBusiness);
  });

  it('handles errors from getBusiness', async () => {
    const error = new Error('Failed to fetch');
    mockBusinessService.getBusiness.mockRejectedValue(error);
    const { result } = renderHook(() => useBusiness());

    await act(async () => {
      await expect(result.current.getBusiness()).rejects.toThrow(error);
    });

    expect(toast.error).toHaveBeenCalledWith('Erro ao carregar dados do negócio');
  });
});
