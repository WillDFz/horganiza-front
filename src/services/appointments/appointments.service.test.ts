import { BaseService } from '../base.service';
import { AppointmentsService } from './appointments.service';
import type { Appointment } from '@/types/api/appointments.types';

jest.mock('../base.service');

describe('AppointmentsService', () => {
  let svc: AppointmentsService;
  let mockApi: { get: jest.Mock; post: jest.Mock; patch: jest.Mock; delete: jest.Mock };

  beforeEach(() => {
    mockApi = { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() };
    (BaseService as unknown as jest.Mock).mockImplementation(function (this: AppointmentsService) {
      Object.defineProperty(this, 'api', {
        value: mockApi,
        writable: true,
        configurable: true,
      });
    });
    svc = new AppointmentsService();
  });

  const appt: Appointment = {
    id: 'a1',
    business_id: 'b',
    staff_member_id: 's',
    customer_id: 'c',
    service_id: 'sv',
    status: 'SCHEDULED',
    schedule_time: '2026-05-06T12:00:00Z',
    customer_name: 'X',
    created_at: '',
    updated_at: '',
  };

  it('getMyAppointments', async () => {
    mockApi.get.mockResolvedValue({ status: 200, data: [appt] });
    await expect(svc.getMyAppointments('b1')).resolves.toEqual([appt]);
    expect(mockApi.get).toHaveBeenCalledWith('/appointment?business_id=b1');
  });

  it('getMyAppointments throws on bad status', async () => {
    mockApi.get.mockResolvedValue({ status: 500, data: [] });
    await expect(svc.getMyAppointments('b1')).rejects.toThrow('Failed to get appointments');
  });

  it('getAppointmentsByStaff', async () => {
    mockApi.get.mockResolvedValue({ status: 200, data: [appt] });
    await expect(svc.getAppointmentsByStaff('s1', 'b1')).resolves.toEqual([appt]);
    expect(mockApi.get).toHaveBeenCalledWith('/appointment/staff?staff=s1&business_id=b1');
  });

  it('getAppointmentsByStaff throws on bad status', async () => {
    mockApi.get.mockResolvedValue({ status: 500, data: [] });
    await expect(svc.getAppointmentsByStaff('s1', 'b1')).rejects.toThrow('Failed to get appointments');
  });

  it('getAppointmentById', async () => {
    mockApi.get.mockResolvedValue({ status: 200, data: appt });
    await expect(svc.getAppointmentById('a1')).resolves.toEqual(appt);
    expect(mockApi.get).toHaveBeenCalledWith('/appointments/a1');
  });

  it('getAppointmentById throws on bad status', async () => {
    mockApi.get.mockResolvedValue({ status: 404, data: null });
    await expect(svc.getAppointmentById('a1')).rejects.toThrow('Failed to get appointment');
  });

  it('createAppointment', async () => {
    mockApi.post.mockResolvedValue({ status: 201, data: appt });
    await expect(svc.createAppointment(appt)).resolves.toEqual(appt);
  });

  it('createAppointment throws when not 201', async () => {
    mockApi.post.mockResolvedValue({ status: 200, data: appt });
    await expect(svc.createAppointment(appt)).rejects.toThrow('Failed to create appointment');
  });

  it('updateAppointment', async () => {
    mockApi.patch.mockResolvedValue({ status: 200, data: appt });
    await expect(svc.updateAppointment('a1', 'CONFIRMED')).resolves.toEqual(appt);
    expect(mockApi.patch).toHaveBeenCalledWith('/appointment/a1', { status: 'CONFIRMED' });
  });

  it('updateAppointment throws on bad status', async () => {
    mockApi.patch.mockResolvedValue({ status: 500, data: appt });
    await expect(svc.updateAppointment('a1', 'CONFIRMED')).rejects.toThrow('Failed to update appointment');
  });

  it('cancelAppointment', async () => {
    const cancelled = { ...appt, status: 'CANCELLED' as const };
    mockApi.patch.mockResolvedValue({ status: 200, data: cancelled });
    await expect(svc.cancelAppointment('a1')).resolves.toEqual(cancelled);
    expect(mockApi.patch).toHaveBeenCalledWith('/appointment/a1', { status: 'CANCELLED' });
  });

  it('deleteAppointment', async () => {
    mockApi.delete.mockResolvedValue({ status: 200, data: undefined });
    await expect(svc.deleteAppointment('a1')).resolves.toBeUndefined();
    expect(mockApi.delete).toHaveBeenCalledWith('/appointment/a1');
  });

  it('deleteAppointment throws on bad status', async () => {
    mockApi.delete.mockResolvedValue({ status: 500, data: undefined });
    await expect(svc.deleteAppointment('a1')).rejects.toThrow('Failed to delete appointment');
  });
});
