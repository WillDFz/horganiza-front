import { AxiosError } from 'axios';
import { StaffService } from './staff.service';
import { BaseService } from '../base.service';
import { CreateStaffMember, StaffMember, Weekday } from '@/types/api/staff.types';

jest.mock('../base.service');

describe('StaffService', () => {
  let staffService: StaffService;
  let mockApi: {
    get: jest.Mock;
    post: jest.Mock;
    put: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    mockApi = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    (BaseService as unknown as jest.Mock).mockImplementation(function (this: StaffService) {
      Object.defineProperty(this, 'api', {
        value: mockApi,
        writable: true,
        configurable: true,
      });
    });

    staffService = new StaffService();
  });

  it('creates a staff member', async () => {
    const payload = { name: 'A' } as CreateStaffMember;
    const response = { id: '1', name: 'A' } as StaffMember;
    mockApi.post.mockResolvedValue({ status: 201, data: response });

    const result = await staffService.createStaffMember(payload);

    expect(mockApi.post).toHaveBeenCalledWith('/staff', payload);
    expect(result).toEqual(response);
  });

  it('gets staff members', async () => {
    const response = [{ id: '1' }] as StaffMember[];
    mockApi.get.mockResolvedValue({ status: 200, data: { staffMembers: response } });

    const result = await staffService.getStaffMembers();

    expect(mockApi.get).toHaveBeenCalledWith('staff/members');
    expect(result).toEqual(response);
  });

  it('getStaffMemberById returns member', async () => {
    const member = { id: '1', name: 'A' } as StaffMember;
    mockApi.get.mockResolvedValue({ status: 200, data: { staffMember: member } });

    await expect(staffService.getStaffMemberById('1')).resolves.toEqual(member);
    expect(mockApi.get).toHaveBeenCalledWith('/staff/1');
  });

  it('getStaffMemberById throws on bad status', async () => {
    mockApi.get.mockResolvedValue({ status: 404, data: null });
    await expect(staffService.getStaffMemberById('1')).rejects.toThrow('Failed to get staff member');
  });

  it('getStaffMembers maps AxiosError', async () => {
    mockApi.get.mockRejectedValue(
      new AxiosError(undefined, '500', undefined, undefined, {
        status: 500,
        data: { message: 'fail' },
        statusText: '',
        headers: {},
        config: { headers: {} } as never,
      }),
    );
    await expect(staffService.getStaffMembers()).rejects.toThrow('fail');
  });

  it('updates a staff member', async () => {
    const payload = { id: '1', name: 'B' } as StaffMember;
    mockApi.put.mockResolvedValue({ status: 200, data: payload });

    const result = await staffService.updateStaffMember(payload);

    expect(mockApi.put).toHaveBeenCalledWith('/staff/1', payload);
    expect(result).toEqual(payload);
  });

  it('deletes a staff member', async () => {
    mockApi.delete.mockResolvedValue({ status: 200, data: undefined });

    await staffService.deleteStaffMember('1');

    expect(mockApi.delete).toHaveBeenCalledWith('/staff/1');
  });

  it('getWeekdays returns schedule array', async () => {
    const rows: Weekday[] = [
      {
        id: '1',
        week_day: 'MONDAY',
        staff_id: 'st',
        start_time: '09:00',
        end_time: '18:00',
        is_active: true,
      },
    ];
    mockApi.get.mockResolvedValue({
      status: 200,
      data: { staffMemberWeekDaySchedule: rows },
    });

    await expect(staffService.getWeekdays('st')).resolves.toEqual(rows);
    expect(mockApi.get).toHaveBeenCalledWith('/staff/st/schedule');
  });

  it('getWeekdays throws on bad status', async () => {
    mockApi.get.mockResolvedValue({
      status: 500,
      data: { staffMemberWeekDaySchedule: [] },
    });
    await expect(staffService.getWeekdays('st')).rejects.toThrow('Failed to get staff schedules');
  });

  it('getWeekdays maps AxiosError', async () => {
    mockApi.get.mockRejectedValue(
      new AxiosError(undefined, '500', undefined, undefined, {
        status: 500,
        data: { message: 'nope' },
        statusText: '',
        headers: {},
        config: { headers: {} } as never,
      }),
    );
    await expect(staffService.getWeekdays('st')).rejects.toThrow('nope');
  });

  it('updateWeekday returns data', async () => {
    const w: Weekday = {
      id: '1',
      week_day: 'MONDAY',
      staff_id: 'st',
      start_time: '10:00',
      end_time: '18:00',
      is_active: true,
    };
    mockApi.put.mockResolvedValue({ status: 200, data: w });
    await expect(staffService.updateWeekday(w)).resolves.toEqual(w);
  });

  it('updateWeekday throws when not 200', async () => {
    mockApi.put.mockResolvedValue({ status: 400, data: {} });
    await expect(
      staffService.updateWeekday({
        id: '1',
        week_day: 'MONDAY',
        staff_id: 'st',
        start_time: '10:00',
        end_time: '18:00',
        is_active: true,
      }),
    ).rejects.toThrow('Failed to update staff schedule');
  });

  it('getAvailableAppointmentRange returns slots', async () => {
    const slots = [
      { init: '2026-05-04T09:00:00.000Z', end: '2026-05-04T09:30:00.000Z' },
    ];
    mockApi.get.mockResolvedValue({ status: 200, data: slots });

    const result = await staffService.getAvailableAppointmentRange({
      staff: 'st1',
      date: '2026-05-04',
      duration: 30,
    });

    expect(mockApi.get).toHaveBeenCalledWith('appointment/staff/schedule', {
      params: { staff: 'st1', date: '2026-05-04', duration: 30 },
    });
    expect(result).toEqual(slots);
  });

  it('getAvailableAppointmentRange maps AxiosError', async () => {
    mockApi.get.mockRejectedValue(
      new AxiosError(undefined, '500', undefined, undefined, {
        status: 500,
        data: { message: 'range fail' },
        statusText: '',
        headers: {},
        config: { headers: {} } as never,
      }),
    );
    await expect(
      staffService.getAvailableAppointmentRange({
        staff: 'st1',
        date: '2026-05-04',
        duration: 30,
      }),
    ).rejects.toThrow('range fail');
  });

  it('getAvailableAppointmentRange throws on bad status', async () => {
    mockApi.get.mockResolvedValue({ status: 500, data: [] });
    await expect(
      staffService.getAvailableAppointmentRange({
        staff: 'st1',
        date: '2026-05-04',
        duration: 30,
      }),
    ).rejects.toThrow('Failed to get available appointment range');
  });
});
