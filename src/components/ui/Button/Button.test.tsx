import { render, screen, fireEvent } from '@testing-library/react';
import Button from './index';

describe('Button', () => {
    it('renders children', () => {
        render(<Button>Salvar</Button>);
        expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Clique</Button>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('is disabled when loading', () => {
        render(<Button loading>Salvar</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies destructive variant class', () => {
        render(<Button variant="destructive">Excluir</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-error');
    });
});
