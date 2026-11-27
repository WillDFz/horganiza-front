import { render, screen } from '@testing-library/react';

import { BookingTimeSlotsSection } from './index';

describe('BookingTimeSlotsSection', () => {
    it('informa quando o profissional não atende no dia', () => {
        render(
            <BookingTimeSlotsSection
                accentColor="#000000"
                daySlots={{
                    isDayActive: false,
                    availableSlots: [],
                    displayRange: null,
                    serviceExceedsWindow: false,
                }}
                customerTime=""
                onSelectTime={jest.fn()}
            />,
        );

        expect(screen.getByText(/não atende neste dia da semana/i)).toBeInTheDocument();
    });

    it('informa quando serviços excedem o expediente', () => {
        render(
            <BookingTimeSlotsSection
                accentColor="#000000"
                daySlots={{
                    isDayActive: true,
                    availableSlots: [],
                    displayRange: '09:00–18:00',
                    serviceExceedsWindow: true,
                }}
                customerTime=""
                onSelectTime={jest.fn()}
            />,
        );

        expect(screen.getByText(/não cabe no expediente/i)).toBeInTheDocument();
    });
});
