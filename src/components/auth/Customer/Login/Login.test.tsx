import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CustomerLoginForm from './index';
import { toast } from 'react-toastify';
import { useBusiness } from '@/hooks/useBusiness';
import { useCustomer } from '@/hooks/useCustomer';
import { useAuth } from '@/contexts/auth-context';

const mockGetBusinessBySlug = jest.fn();
const mockRequestConfirmationCode = jest.fn();
const mockVerifyCode = jest.fn();
const mockCustomerLogin = jest.fn();
const mockPush = jest.fn();

jest.mock('@/hooks/useBusiness', () => ({
  useBusiness: jest.fn(),
}));

jest.mock('@/hooks/useCustomer', () => ({
  useCustomer: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

jest.mock('@/components/auth/ConfirmationCode', () => ({
  __esModule: true,
  default: ({
    setConfirmationCode,
  }: {
    setConfirmationCode: (code: string) => void;
  }) => (
    <input
      data-testid="confirmation-code"
      onChange={(e) => setConfirmationCode(e.target.value)}
    />
  ),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

const mockUseBusiness = useBusiness as jest.MockedFunction<typeof useBusiness>;
const mockUseCustomer = useCustomer as jest.MockedFunction<typeof useCustomer>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

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

describe('CustomerLoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBusinessBySlug.mockResolvedValue(defaultBusiness);
    mockRequestConfirmationCode.mockResolvedValue(true);
    mockVerifyCode.mockResolvedValue(true);
    mockCustomerLogin.mockResolvedValue({});

    mockUseBusiness.mockReturnValue(createUseBusinessMock());

    mockUseCustomer.mockReturnValue({
      loading: false,
      requestConfirmationCode: mockRequestConfirmationCode,
      verifyCode: mockVerifyCode,
      getCustomers: jest.fn().mockResolvedValue([]),
    });

    mockUseAuth.mockReturnValue({
      customerLogin: mockCustomerLogin,
      loading: false,
      user: null,
      sessionChecking: false,
      isAuthenticated: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      customerRegister: jest.fn(),
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      getUserSession: jest.fn(),
    });
  });

  it('renderiza campo de email após carregar negócio', async () => {
    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => {
      expect(mockGetBusinessBySlug).toHaveBeenCalledWith('loja');
    });
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Loja' })).toBeInTheDocument();
  });

  it('exibe logo do negócio quando disponível', async () => {
    mockGetBusinessBySlug.mockResolvedValue({
      ...defaultBusiness,
      logo: 'https://example.com/logo.png',
    });

    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => {
      const logos = screen.getAllByRole('img', { name: 'Logo' });
      expect(
        logos.some((img) => img.getAttribute('src') === 'https://example.com/logo.png'),
      ).toBe(true);
    });
  });

  it('exibe placeholder quando negócio não tem logo', async () => {
    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => {
      expect(screen.getByLabelText('Logo indisponível')).toBeInTheDocument();
    });
  });

  it('exibe loading enquanto carrega negócio', () => {
    mockGetBusinessBySlug.mockImplementation(() => new Promise(() => {}));
    mockUseBusiness.mockReturnValue(createUseBusinessMock({ loading: true }));

    render(<CustomerLoginForm business_slug="loja" />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('exibe erro ao falhar carregamento do negócio', () => {
    mockGetBusinessBySlug.mockImplementation(() => new Promise(() => {}));
    mockUseBusiness.mockReturnValue(createUseBusinessMock({ error: 'Erro de rede' }));

    render(<CustomerLoginForm business_slug="loja" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Erro de rede');
  });

  it('solicita código de confirmação', async () => {
    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'cliente@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar código/i }));

    await waitFor(() => {
      expect(mockRequestConfirmationCode).toHaveBeenCalledWith('cliente@test.com', 'loja');
    });
    expect(toast.success).toHaveBeenCalled();
    expect(screen.getByTestId('confirmation-code')).toBeInTheDocument();
  });

  it('não avança para etapa de código quando solicitação falha', async () => {
    mockRequestConfirmationCode.mockResolvedValue(false);

    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'cliente@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar código/i }));

    await waitFor(() => {
      expect(mockRequestConfirmationCode).toHaveBeenCalled();
    });
    expect(toast.success).not.toHaveBeenCalled();
    expect(screen.queryByTestId('confirmation-code')).not.toBeInTheDocument();
  });

  it('volta para etapa de email ao clicar em alterar e-mail', async () => {
    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'cliente@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar código/i }));

    await waitFor(() => screen.getByTestId('confirmation-code'));

    fireEvent.click(screen.getByRole('button', { name: /alterar e-mail/i }));

    expect(screen.queryByTestId('confirmation-code')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).not.toBeDisabled();
  });

  it('faz login após validar código', async () => {
    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'cliente@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar código/i }));

    await waitFor(() => screen.getByTestId('confirmation-code'));

    fireEvent.change(screen.getByTestId('confirmation-code'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

    await waitFor(() => {
      expect(mockVerifyCode).toHaveBeenCalled();
      expect(mockCustomerLogin).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/business/loja');
    });
  });

  it('não faz login quando verificação do código falha', async () => {
    mockVerifyCode.mockResolvedValue(false);

    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'cliente@test.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar código/i }));

    await waitFor(() => screen.getByTestId('confirmation-code'));

    fireEvent.change(screen.getByTestId('confirmation-code'), {
      target: { value: '123456' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^entrar$/i }));

    await waitFor(() => {
      expect(mockVerifyCode).toHaveBeenCalled();
    });
    expect(mockCustomerLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('renderiza link para cadastro', async () => {
    render(<CustomerLoginForm business_slug="loja" />);

    await waitFor(() => screen.getByLabelText(/email/i));

    const registerLink = screen.getByRole('link', { name: /cadastre-se/i });
    expect(registerLink).toHaveAttribute('href', '/business/loja/auth/register');
  });
});
