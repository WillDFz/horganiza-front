import { renderHook, act } from '@testing-library/react';
import { useService } from './index';
import ServicesService from '@/services/services/service.service';
import { toast } from 'react-toastify';
import type { Service } from '@/types/api/services.types';
import { createMockService } from '@/utils/test';

jest.mock('@/services/services/service.service');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const svc: Service = createMockService({
  id: '1',
  name: 'S',
  price: 10,
  business_id: 'b',
  duration: 20,
});

describe('useService', () => {
  let mock: {
    getServices: jest.Mock;
    createService: jest.Mock;
    deleteService: jest.Mock;
    updateService: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mock = {
      getServices: jest.fn(),
      createService: jest.fn(),
      deleteService: jest.fn(),
      updateService: jest.fn(),
    };
    (ServicesService as jest.Mock).mockImplementation(() => mock);
  });

  it('getServices updates list', async () => {
    mock.getServices.mockResolvedValue([svc]);
    const { result } = renderHook(() => useService());

    await act(async () => {
      await result.current.getServices();
    });

    expect(result.current.services).toEqual([svc]);
  });

  it('createService appends', async () => {
    mock.createService.mockResolvedValue(svc);
    const { result } = renderHook(() => useService());

    await act(async () => {
      await result.current.createService({
        business_id: 'b',
        name: 'S',
        price: 10,
        duration: 20,
        has_staff: true,
        parent_id: '',
      });
    });

    expect(result.current.services).toEqual([svc]);
    expect(toast.success).toHaveBeenCalled();
  });

  it('deleteService filters', async () => {
    mock.getServices.mockResolvedValue([svc]);
    mock.deleteService.mockResolvedValue(undefined);
    const { result } = renderHook(() => useService());

    await act(async () => {
      await result.current.getServices();
    });
    await act(async () => {
      await result.current.deleteService('1');
    });

    expect(result.current.services).toEqual([]);
  });

  it('updateService replaces item', async () => {
    const updated = { ...svc, name: 'New' };
    mock.getServices.mockResolvedValue([svc]);
    mock.updateService.mockResolvedValue(updated);
    const { result } = renderHook(() => useService());

    await act(async () => {
      await result.current.getServices();
    });
    await act(async () => {
      await result.current.updateService({ id: '1', business_id: 'b', name: 'New' });
    });

    expect(result.current.services).toEqual([updated]);
  });
});
