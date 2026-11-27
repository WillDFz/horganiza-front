import { render, screen } from '@testing-library/react';
import SidebarItem from './index';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('SidebarItem', () => {
  const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render sidebar item with label and icon', () => {
    mockUsePathname.mockReturnValue('/dashboard');

    render(<SidebarItem label="Dashboard" href="/dashboard" icon="dashboardOutlined" />);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('should apply active styles when pathname matches href', () => {
    mockUsePathname.mockReturnValue('/dashboard');

    render(<SidebarItem label="Dashboard" href="/dashboard" icon="dashboardOutlined" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });

  it('should not apply active styles when pathname does not match href', () => {
    mockUsePathname.mockReturnValue('/other');

    render(<SidebarItem label="Dashboard" href="/dashboard" icon="dashboardOutlined" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});

