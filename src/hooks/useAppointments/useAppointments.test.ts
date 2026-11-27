import { renderHook, act } from '@testing-library/react';
import { useAppointments } from './index';
import { AppointmentsService } from '@/services/appointments/appointments.service';
import { toast } from 'react-toastify';
import type { Appointment } from '@/types/api/appointments.types';

jest.mock('@/services/appointments/appointments.service');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const appt: Appointment = {
  id: '1',
  business_id: 'b',
  staff_member_id: 's',
  customer_id: 'c',
  service_id: 'v',
  status: 'SCHEDULED',
  schedule_time: '2026-05-06',
  customer_name: 'N',
  created_at: '',
  updated_at: '',
};

describe('useAppointments', () => {
  let mock: {
    getMyAppointments: jest.Mock;
    getAppointmentsByStaff: jest.Mock;
    createAppointment: jest.Mock;
    updateAppointment: jest.Mock;
    cancelAppointment: jest.Mock;
    deleteAppointment: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mock = {
      getMyAppointments: jest.fn(),
      getAppointmentsByStaff: jest.fn(),
      createAppointment: jest.fn(),
      updateAppointment: jest.fn(),
      cancelAppointment: jest.fn(),
      deleteAppointment: jest.fn(),
    };
    (AppointmentsService as jest.Mock).mockImplementation(() => mock);
  });

  it('getMyAppointments', async () => {
    mock.getMyAppointments.mockResolvedValue([appt]);
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.getMyAppointments('b1');
    });

    expect(result.current.appointments).toEqual([appt]);
  });

  it('getAppointmentsByStaff', async () => {
    mock.getAppointmentsByStaff.mockResolvedValue([appt]);
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.getAppointmentsByStaff('s1', 'b1');
    });

    expect(mock.getAppointmentsByStaff).toHaveBeenCalledWith('s1', 'b1');
    expect(result.current.appointments).toEqual([appt]);
  });

  it('createAppointment appends', async () => {
    mock.createAppointment.mockResolvedValue(appt);
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.createAppointment(appt);
    });

    expect(result.current.appointments).toEqual([appt]);
  });

  it('updateAppointment replaces', async () => {
    const next = { ...appt, status: 'CONFIRMED' as const };
    mock.createAppointment.mockResolvedValue(appt);
    mock.updateAppointment.mockResolvedValue(next);
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.createAppointment(appt);
    });
    await act(async () => {
      await result.current.updateAppointment(appt.id, 'CONFIRMED');
    });

    expect(result.current.appointments).toEqual([next]);
  });

  it('cancelAppointment replaces with cancelled status', async () => {
    const cancelled = { ...appt, status: 'CANCELLED' as const };
    mock.createAppointment.mockResolvedValue(appt);
    mock.cancelAppointment.mockResolvedValue(cancelled);
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.createAppointment(appt);
    });
    await act(async () => {
      await result.current.cancelAppointment(appt.id);
    });

    expect(result.current.appointments).toEqual([cancelled]);
  });

  it('deleteAppointment removes from list', async () => {
    mock.createAppointment.mockResolvedValue(appt);
    mock.deleteAppointment.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await result.current.createAppointment(appt);
    });
    await act(async () => {
      await result.current.deleteAppointment(appt.id);
    });

    expect(result.current.appointments).toEqual([]);
  });

  it('surfaces toast on getMyAppointments error', async () => {
    mock.getMyAppointments.mockRejectedValue(new Error('x'));
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await expect(result.current.getMyAppointments('b1')).rejects.toThrow();
    });
    expect(toast.error).toHaveBeenCalled();
  });

  it('surfaces toast on getAppointmentsByStaff error', async () => {
    mock.getAppointmentsByStaff.mockRejectedValue(new Error('x'));
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await expect(result.current.getAppointmentsByStaff('s1', 'b1')).rejects.toThrow();
    });
    expect(toast.error).toHaveBeenCalledWith('Erro ao carregar os agendamentos');
  });

  it('surfaces toast on createAppointment error', async () => {
    mock.createAppointment.mockRejectedValue(new Error('x'));
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await expect(result.current.createAppointment(appt)).rejects.toThrow();
    });
    expect(toast.error).toHaveBeenCalledWith('Erro ao criar o agendamento');
  });

  it('surfaces toast on updateAppointment error', async () => {
    mock.updateAppointment.mockRejectedValue(new Error('x'));
    const { result } = renderHook(() => useAppointments());

    await act(async () => {
      await expect(result.current.updateAppointment(appt.id, 'CONFIRMED')).rejects.toThrow();
    });
    expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar o agendamento');
  });
});
