import { render, screen, waitFor } from '@testing-library/react';
import RouteGuard from './index';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { createMockUseAuth } from '@/utils/test';

jest.mock('@/contexts/auth-context');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('RouteGuard', () => {
    const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
    const mockReplace = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace, push: jest.fn() });
    });

    it('shows loading while session is being checked', () => {
        mockUseAuth.mockReturnValue(
            createMockUseAuth({
                sessionChecking: true,
                isAuthenticated: false,
            }),
        );

        render(
            <RouteGuard>
                <div data-testid="protected-content">Protected Content</div>
            </RouteGuard>,
        );

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('renders children when authenticated', () => {
        mockUseAuth.mockReturnValue(
            createMockUseAuth({
                sessionChecking: false,
                isAuthenticated: true,
            }),
        );

        render(
            <RouteGuard>
                <div data-testid="protected-content">Protected Content</div>
            </RouteGuard>,
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it('redirects to login when not authenticated', async () => {
        mockUseAuth.mockReturnValue(
            createMockUseAuth({
                sessionChecking: false,
                isAuthenticated: false,
            }),
        );

        render(
            <RouteGuard>
                <div data-testid="protected-content">Protected Content</div>
            </RouteGuard>,
        );

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('/auth/login');
        });

        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
});
