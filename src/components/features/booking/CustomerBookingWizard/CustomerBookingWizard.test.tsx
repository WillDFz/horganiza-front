import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { CustomerBookingWizard } from './index';

jest.mock('@/hooks/useCustomerBookingWizard', () => ({
    useCustomerBookingWizard: jest.fn(),
}));

jest.mock('./BookingWizardGate', () => ({
    BookingWizardGate: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock('./CustomerBookingWizardContent', () => ({
    CustomerBookingWizardContent: () => <div>wizard-content</div>,
}));

import { useCustomerBookingWizard } from '@/hooks/useCustomerBookingWizard';

const mockUseCustomerBookingWizard = jest.mocked(useCustomerBookingWizard);

describe('CustomerBookingWizard', () => {
    it('renderiza conteúdo do wizard quando hook retorna estado válido', () => {
        mockUseCustomerBookingWizard.mockReturnValue({
            loading: false,
            business: { id: 'b1' },
            services: [{ id: 's1' }],
            staffMembers: [{ id: 'st1' }],
        } as never);

        render(<CustomerBookingWizard business={null} />);

        expect(screen.getByText('wizard-content')).toBeInTheDocument();
        expect(mockUseCustomerBookingWizard).toHaveBeenCalledWith({ business: null, onBooked: undefined });
    });
});
