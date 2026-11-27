import { render, waitFor } from '@testing-library/react';
import Home from './page';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    replace: mockReplace,
    push: jest.fn(),
  })),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to dashboard on mount', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should render empty div while redirecting', () => {
    const { container } = render(<Home />);

    const div = container.querySelector('div.min-h-screen.bg-white');
    expect(div).toBeInTheDocument();
  });
});
