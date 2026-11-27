import { render, screen, waitFor } from '@testing-library/react';
import CustomerRouteGuard from './index';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { createMockUseAuth } from '@/utils/test';

jest.mock('@/contexts/auth-context');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CustomerRouteGuard', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace, push: jest.fn() });
  });

  it('shows loading while session checking', () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        sessionChecking: true,
        isAuthenticated: false,
        refreshCustomerSession: jest.fn(),
      }),
    );

    render(
      <CustomerRouteGuard business_slug="biz">
        <div data-testid="kid">K</div>
      </CustomerRouteGuard>,
    );

    expect(screen.queryByTestId('kid')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        sessionChecking: false,
        isAuthenticated: true,
        refreshCustomerSession: jest.fn(),
      }),
    );

    render(
      <CustomerRouteGuard business_slug="biz">
        <div data-testid="kid">K</div>
      </CustomerRouteGuard>,
    );

    expect(screen.getByTestId('kid')).toBeInTheDocument();
  });

  it('redirects to customer login when not authenticated', async () => {
    mockUseAuth.mockReturnValue(
      createMockUseAuth({
        sessionChecking: false,
        isAuthenticated: false,
        refreshCustomerSession: jest.fn(),
      }),
    );

    render(
      <CustomerRouteGuard business_slug="acme">
        <div data-testid="kid">K</div>
      </CustomerRouteGuard>,
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/business/acme/auth/login');
    });
    expect(screen.queryByTestId('kid')).not.toBeInTheDocument();
  });
});
