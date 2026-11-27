import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '@/contexts/auth-context';
import LoginPage from './page';
import { createMockUseAuth } from '@/utils/test';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    replace: mockReplace,
    push: jest.fn(),
  })),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/components/auth/Business/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form</div>;
  };
});

describe('Login Page', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to dashboard when user is authenticated', async () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        isAuthenticated: true,
        sessionChecking: false,
      }),
    );

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should render LoginForm when user is not authenticated', () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        isAuthenticated: false,
        sessionChecking: false,
      }),
    );

    render(<LoginPage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should not redirect while session is still checking', () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        isAuthenticated: false,
        sessionChecking: true,
      }),
    );

    render(<LoginPage />);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should render the correct container classes', () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        isAuthenticated: false,
        sessionChecking: false,
      }),
    );

    const { container } = render(<LoginPage />);

    const div = container.querySelector('div.min-h-screen');
    expect(div).toBeInTheDocument();
  });
});
