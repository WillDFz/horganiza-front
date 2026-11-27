import { render, screen } from '@testing-library/react';
import EmptyState from './index';

describe('EmptyState', () => {
    it('renders title and description', () => {
        render(
            <EmptyState
                title="Nenhum cliente cadastrado"
                description="Compartilhe o link público."
            />,
        );
        expect(screen.getByText(/nenhum cliente cadastrado/i)).toBeInTheDocument();
        expect(screen.getByText(/compartilhe o link público/i)).toBeInTheDocument();
    });

    it('renders action slot', () => {
        render(
            <EmptyState
                title="Vazio"
                action={<a href="/test">Ver link</a>}
            />,
        );
        expect(screen.getByRole('link', { name: /ver link/i })).toBeInTheDocument();
    });
});
