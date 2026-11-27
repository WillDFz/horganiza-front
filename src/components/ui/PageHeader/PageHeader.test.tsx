import { render, screen } from '@testing-library/react';
import PageHeader from './index';

describe('PageHeader', () => {
    it('renders title', () => {
        render(<PageHeader title="Clientes" />);
        expect(screen.getByRole('heading', { name: /clientes/i })).toBeInTheDocument();
    });

    it('renders description when provided', () => {
        render(<PageHeader title="Agendamentos" description="Maio de 2026" />);
        expect(screen.getByText(/maio de 2026/i)).toBeInTheDocument();
    });

    it('renders actions slot', () => {
        render(
            <PageHeader
                title="Atendentes"
                actions={<button type="button">Adicionar</button>}
            />,
        );
        expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument();
    });
});
