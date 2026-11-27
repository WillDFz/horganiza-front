import { AxiosError } from 'axios';
import ServicesService from './service.service';
import { BaseService } from '../base.service';
import type { CreateService, Service, UpdateService } from '@/types/api/services.types';

jest.mock('../base.service');

describe('ServicesService', () => {
  let svc: ServicesService;
  let mockApi: { post: jest.Mock; get: jest.Mock; delete: jest.Mock; put: jest.Mock };

  beforeEach(() => {
    mockApi = {
      post: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
      put: jest.fn(),
    };
    (BaseService as unknown as jest.Mock).mockImplementation(function (this: ServicesService) {
      Object.defineProperty(this, 'api', {
        value: mockApi,
        writable: true,
        configurable: true,
      });
    });
    svc = new ServicesService();
  });

  const sampleService: Service = {
    id: '1',
    name: 'Cut',
    price: 50,
    business_id: 'b',
    duration: 30,
    has_staff: true,
    parent_id: '',
    created_at: '',
    updated_at: '',
  };

  it('createService returns service', async () => {
    mockApi.post.mockResolvedValue({ data: { service: sampleService } });
    const payload = {} as CreateService;
    await expect(svc.createService(payload)).resolves.toEqual(sampleService);
    expect(mockApi.post).toHaveBeenCalledWith('/service', payload);
  });

  it('createService maps AxiosError message', async () => {
    mockApi.post.mockRejectedValue(
      new AxiosError(undefined, '400', undefined, undefined, {
        status: 400,
        data: { message: 'dup' },
        statusText: '',
        headers: {},
        config: { headers: {} } as never,
      }),
    );
    await expect(svc.createService({} as CreateService)).rejects.toThrow('dup');
  });

  it('getServices passes query', async () => {
    mockApi.get.mockResolvedValue({ data: { services: [sampleService] } });
    await expect(svc.getServices('hair')).resolves.toEqual([sampleService]);
    expect(mockApi.get).toHaveBeenCalledWith('/service/list', { params: { q: 'hair' } });
  });

  it('deleteService calls API', async () => {
    mockApi.delete.mockResolvedValue({ data: undefined });
    await svc.deleteService('9');
    expect(mockApi.delete).toHaveBeenCalledWith('/service/9');
  });

  it('updateService returns service', async () => {
    const upd: UpdateService = { id: '1', business_id: 'b', name: 'N' };
    mockApi.put.mockResolvedValue({ data: { service: sampleService } });
    await expect(svc.updateService(upd)).resolves.toEqual(sampleService);
    expect(mockApi.put).toHaveBeenCalledWith('/service/1', upd);
  });

  it('getServices maps AxiosError', async () => {
    mockApi.get.mockRejectedValue(
      new AxiosError(undefined, '500', undefined, undefined, {
        status: 500,
        data: { message: 'list fail' },
        statusText: '',
        headers: {},
        config: { headers: {} } as never,
      }),
    );
    await expect(svc.getServices()).rejects.toThrow('list fail');
  });

  it('deleteService maps AxiosError', async () => {
    mockApi.delete.mockRejectedValue(
      new AxiosError(undefined, '400', undefined, undefined, {
        status: 400,
        data: { message: 'cannot delete' },
        statusText: '',
        headers: {},
        config: { headers: {} } as never,
      }),
    );
    await expect(svc.deleteService('9')).rejects.toThrow('cannot delete');
  });

  it('updateService throws generic error', async () => {
    mockApi.put.mockRejectedValue(new Error('network'));
    await expect(svc.updateService({ id: '1', business_id: 'b', name: 'N' })).rejects.toThrow(
      'Failed to update service',
    );
  });
});
