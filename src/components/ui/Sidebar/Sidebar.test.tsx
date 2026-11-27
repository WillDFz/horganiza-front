import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './index';
import { useSidebar } from '@/hooks/useSidebar';

jest.mock('@/hooks/useSidebar', () => ({
  useSidebar: jest.fn(),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => false),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}));

describe('Sidebar', () => {
  const mockOnClose = jest.fn();
  const mockUseSidebar = useSidebar as jest.MockedFunction<typeof useSidebar>;

  const mockNavItems = [
    { label: 'Painel', href: '/dashboard', icon: 'dashboardOutlined' },
    { label: 'Meu Negócio', href: '/dashboard/business', icon: 'businessOutlined' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSidebar.mockReturnValue({
      navItems: mockNavItems,
    });
  });

  it('should render sidebar with navigation items', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText(/painel/i)).toBeInTheDocument();
    expect(screen.getByText(/meu negócio/i)).toBeInTheDocument();
  });

  it('should render close button when sidebar is open on mobile', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText(/fechar menu/i);
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText(/fechar menu/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render overlay when sidebar is open on mobile', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });

  it('should call onClose when overlay is clicked', () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const overlay = document.querySelector('.fixed.inset-0');
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not render overlay when sidebar is closed', () => {
    render(<Sidebar isOpen={false} onClose={mockOnClose} />);

    const overlay = document.querySelector('.fixed.inset-0');
    expect(overlay).not.toBeInTheDocument();
  });
});

