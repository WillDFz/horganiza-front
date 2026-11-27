import type { FormEvent } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { getScheduleSlotStartTime } from '@/components/features/booking/utils/bookingSchedule';
import { BOOKING_DEFAULT_ACCENT } from '@/components/features/booking/constants';
import { useCustomerBookingWizard } from './index';
import { useAuth } from '@/contexts/auth-context';
import { useAppointments } from '@/hooks/useAppointments';
import { useService } from '@/hooks/useService';
import { useStaff } from '@/hooks/useStaff';
import { createMockBusiness, createMockService, createMockUserSession } from '@/utils/test';
import { toast } from 'react-toastify';
import type { Service } from '@/types/api/services.types';
import type { StaffMember } from '@/types/api/staff.types';

jest.mock('@/contexts/auth-context');
jest.mock('@/hooks/useAppointments');
jest.mock('@/hooks/useService');
jest.mock('@/hooks/useStaff');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const service: Service = createMockService({
  id: 's1',
  name: 'Cut',
  price: 50,
  business_id: 'b',
  duration: 30,
});

const extraService: Service = createMockService({
  id: 's2',
  name: 'Extra',
  price: 10,
  business_id: 'b',
  duration: 15,
});

const staff: StaffMember = {
  id: 'st1',
  name: 'Jane',
  role: 'x',
  business_id: 'b',
  created_at: '',
  updated_at: '',
  staffMemberWeekDaySchedule: [
    {
      id: 'w1',
      week_day: 'MONDAY',
      staff_id: 'st1',
      start_time: '09:00',
      end_time: '18:00',
      is_active: true,
    },
  ],
};

describe('useCustomerBookingWizard', () => {
  let createAppointment: jest.Mock;
  let getServices: jest.Mock;
  let getStaffMembers: jest.Mock;
  let getAvailableAppointmentRange: jest.Mock;
  const business = createMockBusiness();

  beforeEach(() => {
    jest.clearAllMocks();
    getServices = jest.fn().mockResolvedValue(undefined);
    getStaffMembers = jest.fn().mockResolvedValue(undefined);
    getAvailableAppointmentRange = jest.fn().mockResolvedValue([
      {
        init: '2026-05-04T09:00:00.000Z',
        end: '2026-05-04T09:30:00.000Z',
      },
    ]);
    createAppointment = jest.fn().mockResolvedValue({});

    (useService as jest.Mock).mockReturnValue({
      getServices,
      services: [service, extraService],
      loading: false,
    });
    (useStaff as jest.Mock).mockReturnValue({
      getStaffMembers,
      getAvailableAppointmentRange,
      staffMembers: [staff],
      loading: false,
    });
    (useAppointments as jest.Mock).mockReturnValue({
      createAppointment,
    });
    (useAuth as jest.Mock).mockReturnValue({
      user: { ...createMockUserSession({ id: 'c1', role: 'CUSTOMER' }) },
    });
  });

  it('fetches services and staff on mount', async () => {
    renderHook(() => useCustomerBookingWizard({ business }));
    await waitFor(() => {
      expect(getServices).toHaveBeenCalled();
      expect(getStaffMembers).toHaveBeenCalled();
    });
  });

  it('uses trimmed business primary_color or default accent', () => {
    const { result: r1 } = renderHook(() =>
      useCustomerBookingWizard({
        business: { ...business, primary_color: '  #abc  ' },
      }),
    );
    expect(r1.current.accentColor).toBe(BOOKING_DEFAULT_ACCENT);

    const { result: r2 } = renderHook(() =>
      useCustomerBookingWizard({
        business: { ...business, primary_color: '   ' },
      }),
    );
    expect(r2.current.accentColor).toBe(BOOKING_DEFAULT_ACCENT);
  });

  it('selectPrimaryService, toggleExtra, goNextFromService', async () => {
    const { result } = renderHook(() => useCustomerBookingWizard({ business }));

    await act(async () => {
      result.current.selectPrimaryService('s1');
    });
    expect(result.current.primaryServiceId).toBe('s1');

    await act(async () => {
      result.current.toggleExtra('s2');
    });
    expect(result.current.extraIds).toEqual(['s2']);
    await act(async () => {
      result.current.toggleExtra('s2');
    });
    expect(result.current.extraIds).toEqual([]);

    await act(async () => {
      result.current.goNextFromService();
    });
    expect(result.current.step).toBe('extras');
  });

  it('goNextFromDatetime shows toast when missing date/time', async () => {
    const { result } = renderHook(() => useCustomerBookingWizard({ business }));

    await act(async () => {
      result.current.selectPrimaryService('s1');
      result.current.goNextFromService();
      result.current.goNextFromExtras();
    });

    await act(async () => {
      result.current.goNextFromDatetime();
    });

    expect(toast.error).toHaveBeenCalledWith('Selecione data e horário');
  });

  it('resetWizard clears step and selections', async () => {
    const { result } = renderHook(() => useCustomerBookingWizard({ business }));

    await act(async () => {
      result.current.selectPrimaryService('s1');
      result.current.goNextFromService();
      result.current.resetWizard();
    });

    expect(result.current.step).toBe('service');
    expect(result.current.primaryServiceId).toBeNull();
  });

  it('submits appointment when form valid', async () => {
    const onBooked = jest.fn();
    const monday = new Date(2026, 4, 4);
    const { result } = renderHook(() =>
      useCustomerBookingWizard({ business, onBooked }),
    );

    await act(async () => {
      result.current.selectPrimaryService('s1');
      result.current.goNextFromService();
      result.current.goNextFromExtras();
    });

    await act(async () => {
      result.current.selectBookingDate(monday);
    });

    await waitFor(() => {
      expect(getAvailableAppointmentRange).toHaveBeenCalledWith({
        staff: 'st1',
        date: '2026-05-04',
        duration: 30,
      });
      expect(result.current.daySlots.availableSlots.length).toBeGreaterThan(0);
    });

    const slot = result.current.daySlots.availableSlots[0];
    const selectedTime = getScheduleSlotStartTime(slot);

    await act(async () => {
      result.current.setCustomerTime(selectedTime);
      result.current.setFirstName('Ana');
      result.current.setLastName('Silva');
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent);
    });

    expect(createAppointment).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(onBooked).toHaveBeenCalled();
  });
});
