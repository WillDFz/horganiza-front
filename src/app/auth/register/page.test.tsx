import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '@/contexts/auth-context';
import RegisterPage from './page';
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

jest.mock('@/components/auth/Business/RegisterForm', () => {
  return function MockRegisterForm() {
    return <div data-testid="register-form">Register Form</div>;
  };
});

describe('Register Page', () => {
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

    render(<RegisterPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should render RegisterForm when user is not authenticated', () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        isAuthenticated: false,
        sessionChecking: false,
      }),
    );

    render(<RegisterPage />);

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should render the correct container classes', () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        isAuthenticated: false,
        sessionChecking: false,
      }),
    );

    const { container } = render(<RegisterPage />);

    const div = container.querySelector('div.min-h-screen');
    expect(div).toBeInTheDocument();
  });
});
