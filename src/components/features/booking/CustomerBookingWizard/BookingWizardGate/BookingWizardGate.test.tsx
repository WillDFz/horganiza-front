import { render, screen } from '@testing-library/react';

import { BookingWizardGate } from './index';

import type { CustomerBookingWizardState } from '@/hooks/useCustomerBookingWizard';

function createWizardState(overrides: Partial<CustomerBookingWizardState> = {}): CustomerBookingWizardState {
    return {
        loading: false,
        business: { id: 'b1', phone: '' } as CustomerBookingWizardState['business'],
        services: [{ id: 's1' } as CustomerBookingWizardState['services'][number]],
        staffMembers: [{ id: 'st1' } as CustomerBookingWizardState['staffMembers'][number]],
        ...overrides,
    } as CustomerBookingWizardState;
}

describe('BookingWizardGate', () => {
    it('renderiza loading quando carregando', () => {
        render(
            <BookingWizardGate wizard={createWizardState({ loading: true })}>
                <div>conteúdo</div>
            </BookingWizardGate>,
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByText('conteúdo')).not.toBeInTheDocument();
    });

    it('renderiza mensagem quando negócio não carregou', () => {
        render(
            <BookingWizardGate wizard={createWizardState({ business: null })}>
                <div>conteúdo</div>
            </BookingWizardGate>,
        );

        expect(screen.getByText('Não foi possível carregar o negócio.')).toBeInTheDocument();
    });

    it('renderiza mensagem quando não há serviços', () => {
        render(
            <BookingWizardGate wizard={createWizardState({ services: [] })}>
                <div>conteúdo</div>
            </BookingWizardGate>,
        );

        expect(screen.getByText('Nenhum serviço disponível para agendamento.')).toBeInTheDocument();
    });

    it('renderiza mensagem quando não há profissionais', () => {
        render(
            <BookingWizardGate wizard={createWizardState({ staffMembers: [] })}>
                <div>conteúdo</div>
            </BookingWizardGate>,
        );

        expect(
            screen.getByText('Nenhum profissional cadastrado. Entre em contato com o estabelecimento.'),
        ).toBeInTheDocument();
    });

    it('renderiza children quando dados estão disponíveis', () => {
        render(
            <BookingWizardGate wizard={createWizardState()}>
                <div>conteúdo do wizard</div>
            </BookingWizardGate>,
        );

        expect(screen.getByText('conteúdo do wizard')).toBeInTheDocument();
    });
});
