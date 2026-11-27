import { render, screen } from '@testing-library/react';
import DashboardPage from './page';
import { createMockUserSession } from '@/utils/test';

jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: () => ({
    getAppointments: jest.fn().mockResolvedValue([]),
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

describe('Dashboard Page', () => {
  it('should render dashboard content', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Painel')).toBeInTheDocument();
    expect(screen.getByText('Próximos agendamentos')).toBeInTheDocument();
  });

  it('should render the correct heading', () => {
    render(<DashboardPage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Painel');
  });
});
