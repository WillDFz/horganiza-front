import { render, screen, fireEvent } from '@testing-library/react';
import BaseLayout from './index';

jest.mock('@/utils/RouteGuard/Business', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/ui/Header', () => ({
  __esModule: true,
  default: ({ onMenuClick }: { onMenuClick: () => void }) => (
    <header>
      <button onClick={onMenuClick}>Menu</button>
    </header>
  ),
}));

jest.mock('@/components/ui/Sidebar', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <aside>
      {isOpen && <button onClick={onClose}>Close</button>}
      <nav>Sidebar</nav>
    </aside>
  ),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => false),
}));

describe('BaseLayout', () => {
  it('should render children', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });

  it('should render header', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });

  it('should render sidebar', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    expect(screen.getByText(/sidebar/i)).toBeInTheDocument();
  });

  it('should toggle sidebar when menu button is clicked', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('should close sidebar when close button is clicked', () => {
    render(
      <BaseLayout>
        <div>Test Content</div>
      </BaseLayout>
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });
});

