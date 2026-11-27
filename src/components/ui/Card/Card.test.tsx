import { render, screen } from '@testing-library/react';
import Card from './index';

describe('Card', () => {
    it('renders children', () => {
        render(<Card>Conteúdo</Card>);
        expect(screen.getByText(/conteúdo/i)).toBeInTheDocument();
    });

    it('applies default surface styles', () => {
        render(<Card data-testid="card">Conteúdo</Card>);
        expect(screen.getByTestId('card')).toHaveClass('bg-surface', 'rounded-lg', 'shadow-md');
    });
});
