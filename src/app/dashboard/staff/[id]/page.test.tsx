import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffMemberPage from './page';
import { createMockStaffMember, createMockUseStaff, createMockUserSession } from '@/utils/test';

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'staff-1' }),
}));

jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: () => ({
    getAppointments: jest.fn().mockResolvedValue(undefined),
    appointments: [],
    loading: false,
    getMyAppointments: jest.fn(),
    createAppointment: jest.fn(),
    updateAppointment: jest.fn(),
  }),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    user: createMockUserSession({ business_id: 'b1' }),
  }),
}));

jest.mock('@/components/features/staff/Schedule', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div data-testid="schedule">Schedule {id}</div>,
}));

jest.mock('@/components/ui/Calendar', () => ({
  __esModule: true,
  default: () => <div data-testid="calendar">Calendar</div>,
}));

jest.mock('@/hooks/useStaff', () => ({
  useStaff: jest.fn(),
}));

jest.mock('@/components/features/staff/Info', () => ({
  __esModule: true,
  default: () => <div data-testid="staff-info">Staff Info</div>,
}));

const mockUseStaff = jest.requireMock('@/hooks/useStaff').useStaff as jest.Mock;

describe('StaffMemberPage', () => {
  beforeEach(() => {
    mockUseStaff.mockReturnValue(
      createMockUseStaff({
        staffMember: createMockStaffMember({ id: 'staff-1' }),
        getStaffMemberById: jest.fn().mockResolvedValue(undefined),
      }),
    );
  });
  it('renderiza abas e conteúdo de horários', async () => {
    render(<StaffMemberPage />);

    expect(screen.getByRole('tab', { name: /horários/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /horários/i }));

    await waitFor(() => {
      expect(screen.getByTestId('schedule')).toHaveTextContent('staff-1');
    });
  });
});
