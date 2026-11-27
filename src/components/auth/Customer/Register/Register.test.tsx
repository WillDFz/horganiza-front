import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CustomerRegisterForm from './index';
import { useBusiness } from '@/hooks/useBusiness';
import { useAuth } from '@/contexts/auth-context';

const mockGetBusinessBySlug = jest.fn();
const mockCustomerRegister = jest.fn();
const mockPush = jest.fn();

jest.mock('@/hooks/useBusiness', () => ({
  useBusiness: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUseBusiness = useBusiness as jest.MockedFunction<typeof useBusiness>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const defaultBusiness = {
  id: 'b1',
  business_id: 'b1',
  name: 'Loja',
  logo: '',
};

const createUseBusinessMock = (
  overrides: Partial<ReturnType<typeof useBusiness>> = {},
): ReturnType<typeof useBusiness> => ({
  getBusinessBySlug: mockGetBusinessBySlug,
  loading: false,
  error: null,
  getBusiness: jest.fn(),
  updateBusiness: jest.fn(),
  business: null,
  ...overrides,
});

describe('CustomerRegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBusinessBySlug.mockResolvedValue(defaultBusiness);
    mockCustomerRegister.mockResolvedValue({ id: 'c1' });
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
    } as unknown as ReturnType<typeof useRouter>);

    mockUseBusiness.mockReturnValue(createUseBusinessMock());

    mockUseAuth.mockReturnValue({
      customerRegister: mockCustomerRegister,
      loading: false,
      user: null,
      sessionChecking: false,
      isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      customerLogin: jest.fn(),
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      getUserSession: jest.fn(),
    });
  });

  it('busca negócio pelo slug e exibe email', async () => {
    render(<CustomerRegisterForm business_slug="loja" />);

    await waitFor(() => {
      expect(mockGetBusinessBySlug).toHaveBeenCalledWith('loja');
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Loja' })).toBeInTheDocument();
    });
  });

  it('exibe loading enquanto carrega negócio', () => {
    mockGetBusinessBySlug.mockImplementation(() => new Promise(() => {}));
    mockUseBusiness.mockReturnValue(createUseBusinessMock({ loading: true }));

    render(<CustomerRegisterForm business_slug="loja" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('exibe erro ao falhar carregamento do negócio', () => {
    mockGetBusinessBySlug.mockImplementation(() => new Promise(() => {}));
    mockUseBusiness.mockReturnValue(createUseBusinessMock({ error: 'Negócio indisponível' }));

    render(<CustomerRegisterForm business_slug="loja" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Negócio indisponível');
  });

  it('cadastra cliente e redireciona para login', async () => {
    render(<CustomerRegisterForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'novo@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockCustomerRegister).toHaveBeenCalledWith({
        email: 'novo@test.com',
        business_id: 'b1',
      });
      expect(mockPush).toHaveBeenCalledWith('/business/loja/auth/login');
    });
  });

  it('não redireciona quando cadastro retorna vazio', async () => {
    mockCustomerRegister.mockResolvedValue(null);

    render(<CustomerRegisterForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'novo@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(mockCustomerRegister).toHaveBeenCalled();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renderiza link para login', async () => {
    render(<CustomerRegisterForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    const loginLink = screen.getByRole('link', { name: /já tem uma conta/i });
    expect(loginLink).toHaveAttribute('href', '/business/loja/auth/login');
  });
});
