import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import LoginForm from './index';
import { useAuth } from '@/contexts/auth-context';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);

    mockUseAuth.mockReturnValue({
      user: null,
      login: mockLogin,
      loading: false,
      sessionChecking: false,
      register: jest.fn(),
      logout: jest.fn(),
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
      isAuthenticated: false,
      getUserSession: jest.fn(),
    });
  });

  it('should render login form with email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show password toggle button', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/senha/i);
    const toggleButton = screen.getByRole('button', { name: '' });

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('should update email field when typing', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should update password field when typing', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/senha/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  it('should call login function on form submit', async () => {
    mockLogin.mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      phone: '123',
      role: 'USER',
      business_id: '1',
      confirmed_email: false,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should navigate to dashboard after successful login', async () => {
    mockLogin.mockResolvedValue({
      id: '1',
      name: 'Test',
      email: 'test@example.com',
      phone: '123',
      role: 'USER',
      business_id: '1',
      confirmed_email: false,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show loading state when submitting', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: mockLogin,
      loading: true,
      sessionChecking: false,
      register: jest.fn(),
      logout: jest.fn(),
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
      isAuthenticated: false,
      getUserSession: jest.fn(),
    });

    render(<LoginForm />);

    expect(screen.queryByText(/entrar/i)).not.toBeInTheDocument();
  });

  it('should render link to register page', () => {
    render(<LoginForm />);

    const registerLink = screen.getByRole('link', { name: /cadastre-se/i });
    expect(registerLink).toHaveAttribute('href', '/auth/register');
  });
});

