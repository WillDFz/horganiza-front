import { render, screen } from '@testing-library/react';
import UnauthorisedPage from './page';

describe('Unauthorised Page', () => {
  it('should render the unauthorised message', () => {
    render(<UnauthorisedPage />);
    
    expect(screen.getByText('Você não está autorizado a acessar esta página')).toBeInTheDocument();
  });

  it('should render the correct heading', () => {
    render(<UnauthorisedPage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Você não está autorizado a acessar esta página');
  });
});

