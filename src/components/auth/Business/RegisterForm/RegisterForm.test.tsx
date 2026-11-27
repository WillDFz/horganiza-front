import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import RegisterForm from './index';
import { useAuth } from '@/contexts/auth-context';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

describe('RegisterForm', () => {
  const mockPush = jest.fn();
  const mockRegister = jest.fn();
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);

    mockUseAuth.mockReturnValue({
      user: null,
      register: mockRegister,
      loading: false,
      sessionChecking: false,
      login: jest.fn(),
      logout: jest.fn(),
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
      isAuthenticated: false,
      getUserSession: jest.fn(),
    });
  });

  it('should render register form with all required fields', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/senha/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('should update form fields when typing', () => {
    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(nameInput.value).toBe('John Doe');
  });

  it('should show error when passwords do not match', () => {
    render(<RegisterForm />);

    const passwordInputs = screen.getAllByLabelText(/senha/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });

    expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
  });

  it('should not show error when passwords match', () => {
    render(<RegisterForm />);

    const passwordInputs = screen.getAllByLabelText(/senha/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(screen.queryByText(/as senhas não coincidem/i)).not.toBeInTheDocument();
  });

  it('should call register function on form submit', async () => {
    mockRegister.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      password: 'password123',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    });

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/telefone/i);
    const passwordInputs = screen.getAllByLabelText(/senha/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123456789' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123456789',
          password: 'password123',
          confirmed_email: false,
        }),
      );
    });
  });

  it('should navigate to dashboard after successful registration', async () => {
    mockRegister.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      password: 'password123',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    });

    render(<RegisterForm />);

    const nameInput = screen.getByLabelText(/nome/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/telefone/i);
    const passwordInputs = screen.getAllByLabelText(/senha/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '123456789' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show loading state when submitting', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      register: mockRegister,
      loading: true,
      sessionChecking: false,
      login: jest.fn(),
      logout: jest.fn(),
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
      isAuthenticated: false,
      getUserSession: jest.fn(),
    });

    render(<RegisterForm />);

    expect(screen.queryByText(/cadastrar/i)).not.toBeInTheDocument();
  });

  it('should render link to login page', () => {
    render(<RegisterForm />);

    const loginLink = screen.getByRole('link', { name: /já tem uma conta\? entre/i });
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });
});

