import { render, screen, fireEvent } from '@testing-library/react';
import CreateStaffMember from './index';
import { useStaff } from '@/hooks/useStaff';
import { useAuth } from '@/contexts/auth-context';
import { createMockUseStaff, createMockUserSession } from '@/utils/test';

jest.mock('@/hooks/useStaff', () => ({
  useStaff: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

describe('CreateStaffMember', () => {
  const mockCreateStaffMember = jest.fn();
  const mockGetUserSession = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockUseStaff = useStaff as jest.MockedFunction<typeof useStaff>;
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStaff.mockReturnValue(
      createMockUseStaff({
        createStaffMember: mockCreateStaffMember,
      }),
    );

    mockUseAuth.mockReturnValue({
      user: createMockUserSession({ business_id: 'biz-1' }),
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

  it('should render create staff member form', () => {
    render(<CreateStaffMember onClose={mockOnClose} />);

    expect(screen.getAllByText(/adicionar atendente/i).length).toBeGreaterThan(0);
  });

  it('should render all form fields', () => {
    render(<CreateStaffMember onClose={mockOnClose} />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getAllByText(/cargo/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('should update form fields when typing', () => {
    render(<CreateStaffMember onClose={mockOnClose} />);

    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(nameInput.value).toBe('John Doe');
  });

  it('should show password toggle button', () => {
    render(<CreateStaffMember onClose={mockOnClose} />);

    const passwordInput = screen.getByLabelText(/senha/i);
    const toggleButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
  });

  it('should render submit button', () => {
    render(<CreateStaffMember onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const submitButtons = screen.getAllByRole('button', { name: /adicionar atendente/i });
    expect(submitButtons.length).toBeGreaterThan(0);
  });

  it('should have form structure', () => {
    render(<CreateStaffMember onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});

