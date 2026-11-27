import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BusinessPage from './page';
import { createMockService } from '@/utils/test';

const mockGetUserSession = jest.fn().mockResolvedValue(null);
const mockLogout = jest.fn().mockResolvedValue(undefined);
const mockGetBusinessBySlug = jest.fn();
const mockGetMyAppointments = jest.fn();
const mockGetServices = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'loja-x' }),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    getUserSession: mockGetUserSession,
    loading: false,
    isAuthenticated: true,
    logout: mockLogout,
    user: { id: 'u1', name: 'Cliente' },
    sessionChecking: false,
    login: jest.fn(),
    register: jest.fn(),
    customerLogin: jest.fn(),
    customerRegister: jest.fn(),
    refreshBusinessSession: jest.fn(),
    refreshCustomerSession: jest.fn(),
  }),
}));

jest.mock('@/hooks/useBusiness', () => ({
  useBusiness: () => ({
    getBusinessBySlug: mockGetBusinessBySlug,
    loading: false,
    getBusiness: jest.fn(),
    updateBusiness: jest.fn(),
    error: null,
  }),
}));

jest.mock('@/hooks/useAppointments', () => ({
  useAppointments: () => ({
    getMyAppointments: mockGetMyAppointments,
    appointments: [
      {
        id: 'apt-1',
        business_id: 'b1',
        customer_id: 'u1',
        service_id: 'svc-1',
        customer_name: 'Cliente',
        status: 'SCHEDULED',
        schedule_time: new Date(Date.now() + 86400000).toISOString(),
        created_at: '',
        updated_at: '',
      },
    ],
    loading: false,
    getAppointments: jest.fn(),
    createAppointment: jest.fn(),
    updateAppointment: jest.fn(),
  }),
}));

jest.mock('@/hooks/useService', () => ({
  useService: () => ({
    getServices: mockGetServices,
    services: [createMockService({ id: 'svc-1', name: 'Corte' })],
    loading: false,
    createService: jest.fn(),
    updateService: jest.fn(),
    deleteService: jest.fn(),
  }),
}));

jest.mock('@/components/layout/CustomerLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="customer-layout">{children}</div>
  ),
}));

jest.mock('@/components/features/booking', () => ({
  CustomerBookingWizard: () => <div data-testid="booking-wizard" />,
}));

jest.mock('@/components/ui/BaseModal', () => ({
  __esModule: true,
  default: ({
    open,
    children,
    onClose,
  }: {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="appointment-detail-modal">
        {children}
        <button type="button" onClick={onClose}>
          Fechar detalhes
        </button>
      </div>
    ) : null,
}));

describe('BusinessPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBusinessBySlug.mockResolvedValue({
      id: 'b1',
      business_id: 'b1',
      name: 'Loja',
      interval_minutes: 30,
      primary_color: '#2563eb',
      secondary_color: '#fff',
      contact_email: 'a@b.com',
      phone: '11',
      instagram_url: '',
      facebook_url: '',
      logo: '',
      created_at: '',
      updated_at: '',
    });
  });

  it('renderiza layout de cliente após carregar negócio', async () => {
    render(<BusinessPage />);

    await waitFor(() => {
      expect(screen.getByTestId('customer-layout')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /bem-vindo ao loja/i })).toBeInTheDocument();
    });
    expect(screen.getByTestId('booking-wizard')).toBeInTheDocument();
  });

  it('lista próximos agendamentos e abre detalhes', async () => {
    render(<BusinessPage />);

    await waitFor(() => {
      expect(screen.getByText(/seus próximos agendamentos/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /abrir detalhes/i }));

    expect(screen.getByTestId('appointment-detail-modal')).toBeInTheDocument();
    expect(screen.getByText(/detalhes do agendamento/i)).toBeInTheDocument();
    expect(screen.getByText('Corte')).toBeInTheDocument();
  });

  it('faz logout com redirect para login do negócio', async () => {
    render(<BusinessPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /sair/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith('/business/loja-x/auth/login');
    });
  });
});
