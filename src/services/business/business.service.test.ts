import BusinessService from './business.service';
import { BaseService } from '../base.service';
import { Business } from '@/types/api/business.types';

jest.mock('../base.service');

describe('BusinessService', () => {
  let businessService: BusinessService;
  let mockApi: {
    get: jest.Mock;
    put: jest.Mock;
  };

  beforeEach(() => {
    mockApi = {
      get: jest.fn(),
      put: jest.fn(),
    };

    (BaseService as unknown as jest.Mock).mockImplementation(function (this: BusinessService) {
      Object.defineProperty(this, 'api', {
        value: mockApi,
        writable: true,
        configurable: true,
      });
    });

    businessService = new BusinessService();
  });

  it('returns business from getBusiness', async () => {
    const business = { id: '1' } as Business;
    mockApi.get.mockResolvedValue({ status: 200, data: { business } });

    const result = await businessService.getBusiness();

    expect(mockApi.get).toHaveBeenCalledWith('/business');
    expect(result).toEqual(business);
  });

  it('returns business from getBusinessBySlug', async () => {
    const business = { id: '1' } as Business;
    mockApi.get.mockResolvedValue({ status: 200, data: { business } });

    const result = await businessService.getBusinessBySlug('slug-x');

    expect(mockApi.get).toHaveBeenCalledWith('/business/slug-x');
    expect(result).toEqual(business);
  });

  it('updates business', async () => {
    const business = { id: '1' } as Business;
    mockApi.put.mockResolvedValue({ status: 200, data: { business } });

    const result = await businessService.updateBusiness(business);

    expect(mockApi.put).toHaveBeenCalledWith('/business', business);
    expect(result).toEqual(business);
  });

  it('getBusiness throws on non-200 status', async () => {
    mockApi.get.mockResolvedValue({ status: 500, data: {} });
    await expect(businessService.getBusiness()).rejects.toThrow('Failed to get business');
  });

  it('getBusiness throws on network error', async () => {
    mockApi.get.mockRejectedValue(new Error('network'));
    await expect(businessService.getBusiness()).rejects.toThrow('Failed to get business');
  });

  it('getBusinessBySlug throws when not found', async () => {
    mockApi.get.mockResolvedValue({ status: 404, data: {} });
    await expect(businessService.getBusinessBySlug('missing')).rejects.toThrow(
      'Erro ao carregar dados do negócio',
    );
  });

  it('updateBusiness throws on failure', async () => {
    mockApi.put.mockRejectedValue(new Error('network'));
    await expect(businessService.updateBusiness({ id: '1' } as Business)).rejects.toThrow(
      'Failed to update business',
    );
  });
});
