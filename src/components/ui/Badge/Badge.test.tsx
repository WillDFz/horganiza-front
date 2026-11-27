import { render, screen } from '@testing-library/react';
import Badge from './index';

describe('Badge', () => {
    it('renders children', () => {
        render(<Badge>Confirmado</Badge>);
        expect(screen.getByText(/confirmado/i)).toBeInTheDocument();
    });

    it('applies success variant class', () => {
        render(<Badge variant="success">Confirmado</Badge>);
        expect(screen.getByText(/confirmado/i)).toHaveClass('bg-success-subtle');
    });

    it('applies brand variant class', () => {
        render(<Badge variant="brand">Agendado</Badge>);
        expect(screen.getByText(/agendado/i)).toHaveClass('bg-primary-900');
    });
});
