import { render, screen } from '@testing-library/react';

import { CustomerBookingWizardContent } from './index';

import type { CustomerBookingWizardState } from '@/hooks/useCustomerBookingWizard';

jest.mock('../BookingWizardStepContent', () => ({
    BookingWizardStepContent: () => <div>step-content</div>,
}));

function createWizardState(
    overrides: Partial<CustomerBookingWizardState> = {},
): CustomerBookingWizardState {
    return {
        step: 'service',
        accentColor: '#000000',
        loading: false,
        submitting: false,
        business: { id: 'b1', phone: '(11) 99999-9999' } as CustomerBookingWizardState['business'],
        primary: null,
        extrasSelected: [],
        lineItems: [],
        totalPrice: 0,
        bookingDate: null,
        customerTime: '',
        handleSubmit: jest.fn(),
        ...overrides,
    } as CustomerBookingWizardState;
}

describe('CustomerBookingWizardContent', () => {
    it('renderiza instruções e conteúdo do step', () => {
        render(<CustomerBookingWizardContent wizard={createWizardState({ step: 'service' })} />);

        expect(screen.getByText('Selecione o serviço')).toBeInTheDocument();
        expect(screen.getByText('step-content')).toBeInTheDocument();
    });

    it('renderiza resumo fora do step de serviço', () => {
        render(<CustomerBookingWizardContent wizard={createWizardState({ step: 'extras' })} />);

        expect(screen.getByText('Resumo')).toBeInTheDocument();
    });
});
