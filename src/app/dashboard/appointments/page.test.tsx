import { render, screen } from '@testing-library/react';
import AppointmentsPage from './page';
import { createMockUserSession } from '@/utils/test';

jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: () => ({
    appointments: [],
    loading: false,
    getMyAppointments: jest.fn(),
    getAppointments: jest.fn(),
    createAppointment: jest.fn(),
    updateAppointment: jest.fn(),
    deleteAppointment: jest.fn(),
  }),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    user: createMockUserSession({ business_id: 'b1' }),
  }),
}));

jest.mock('@/components/ui/Calendar', () => ({
  __esModule: true,
  default: () => <div data-testid="calendar-mock">Calendar</div>,
}));

describe('AppointmentsPage', () => {
  it('mostra o calendário quando não está carregando', () => {
    render(<AppointmentsPage />);
    expect(screen.getByTestId('calendar-mock')).toBeInTheDocument();
  });
});
