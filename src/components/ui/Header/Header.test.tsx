import { render, screen, fireEvent } from '@testing-library/react';
import Header from './index';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => false),
}));

describe('Header', () => {
  const mockOnMenuClick = jest.fn();
  const mockLogout = jest.fn();
  const mockPush = jest.fn();
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    mockUseAuth.mockReturnValue({
      logout: mockLogout,
      isAuthenticated: false,
      sessionChecking: false,
      user: null,
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      loading: false,
      getUserSession: jest.fn(),
    });
  });

  it('should render header with logo', () => {
    render(<Header onMenuClick={mockOnMenuClick} />);

    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('should call onMenuClick when menu button is clicked', () => {
    render(<Header onMenuClick={mockOnMenuClick} />);

    const menuButton = screen.getByLabelText(/abrir menu/i);
    fireEvent.click(menuButton);

    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
  });

  it('should show login button when not authenticated', () => {
    render(<Header onMenuClick={mockOnMenuClick} />);

    const loginButton = screen.getByLabelText(/login/i);
    expect(loginButton).toBeInTheDocument();
  });

  it('should show logout button when authenticated', () => {
    mockUseAuth.mockReturnValue({
      logout: mockLogout,
      isAuthenticated: true,
      sessionChecking: false,
      user: null,
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      loading: false,
      getUserSession: jest.fn(),
    });

    render(<Header onMenuClick={mockOnMenuClick} />);

    const logoutButton = screen.getByLabelText(/logout/i);
    expect(logoutButton).toBeInTheDocument();
  });

  it('should call logout when logout button is clicked', () => {
    mockUseAuth.mockReturnValue({
      logout: mockLogout,
      isAuthenticated: true,
      sessionChecking: false,
      user: null,
      refreshBusinessSession: jest.fn(),
      refreshCustomerSession: jest.fn(),
      customerLogin: jest.fn(),
      customerRegister: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      loading: false,
      getUserSession: jest.fn(),
    });

    render(<Header onMenuClick={mockOnMenuClick} />);

    const logoutButton = screen.getByLabelText(/logout/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

