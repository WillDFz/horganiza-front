import { render, screen } from '@testing-library/react';
import NotFoundPage from './page';

describe('404 Page', () => {
  it('should render the not found message', () => {
    render(<NotFoundPage />);
    
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
  });

  it('should render the correct heading', () => {
    render(<NotFoundPage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Página não encontrada');
  });
});

