import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateBusiness from './index';
import { useBusiness } from '@/hooks/useBusiness';
import { useAuth } from '@/contexts/auth-context';

jest.mock('@/hooks/useBusiness', () => ({
  useBusiness: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => false),
}));

jest.mock('@/hooks/useUpload', () => ({
  useUpload: () => ({
    uploadFile: jest.fn().mockResolvedValue('https://cdn.example/logo.png'),
  }),
}));

describe('CreateBusiness', () => {
  const mockUpdateBusiness = jest.fn().mockResolvedValue({});
  const mockGetBusiness = jest.fn();
  const mockGetUserSession = jest.fn();
  const mockUseBusiness = useBusiness as jest.MockedFunction<typeof useBusiness>;
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBusiness.mockReturnValue({
      getBusiness: mockGetBusiness,
      business: null,
      loading: false,
      updateBusiness: mockUpdateBusiness,
      getBusinessBySlug: jest.fn(),
      error: null,
    });

    mockUseAuth.mockReturnValue({
      user: null,
      getUserSession: mockGetUserSession,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      loading: false,
      sessionChecking: false,
      isAuthenticated: true,
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
    });

    mockGetUserSession.mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      phone: '123',
      role: 'USER',
      business_id: '1',
      confirmed_email: false,
    });
  });

  it('should render create business form', () => {
    render(<CreateBusiness />);

    expect(screen.getByRole('heading', { name: /informações do negócio/i })).toBeInTheDocument();
  });

  it('should render tabs', () => {
    render(<CreateBusiness />);

    expect(screen.getByRole('tab', { name: /identidade/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /contato/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /agendamento/i })).toBeInTheDocument();
  });

  it('should update form fields when typing', () => {
    render(<CreateBusiness />);

    const nameInput = screen.getByLabelText(/nome do negócio/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'My Business' } });

    expect(nameInput.value).toBe('My Business');
  });

  it('should switch tabs when clicking on tab', () => {
    render(<CreateBusiness />);

    const contactTab = screen.getByText(/contato/i);
    fireEvent.click(contactTab);

    expect(screen.getByLabelText(/email de contato/i)).toBeInTheDocument();
  });

  it('should render submit button', async () => {
    render(<CreateBusiness />);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /salvar/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  it('should submit business data', async () => {
    mockUseBusiness.mockReturnValue({
      getBusiness: mockGetBusiness,
      business: {
        id: 'b1',
        business_id: 'b1',
        name: 'Loja',
        url: 'loja',
        interval_minutes: 30,
        primary_color: '#111111',
        secondary_color: '#222222',
        contact_email: 'loja@test.com',
        phone: '11999999999',
        instagram_url: '',
        facebook_url: '',
        logo: '',
        created_at: '',
        updated_at: '',
      },
      loading: false,
      updateBusiness: mockUpdateBusiness,
      getBusinessBySlug: jest.fn(),
      error: null,
    });

    render(<CreateBusiness />);

    await waitFor(() => {
      expect(screen.getByLabelText(/nome do negócio/i)).toHaveValue('Loja');
    });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockUpdateBusiness).toHaveBeenCalled();
    });
  });
});

