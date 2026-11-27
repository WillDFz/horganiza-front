import { fireEvent, render, screen } from '@testing-library/react';

import { BookingTimeSlotsGrid } from './index';

describe('BookingTimeSlotsGrid', () => {
    it('renderiza horários e permite selecionar', () => {
        const onSelectTime = jest.fn();

        render(
            <BookingTimeSlotsGrid
                accentColor="#222222"
                slotStarts={['10:00', '10:30']}
                selectedTime=""
                onSelectTime={onSelectTime}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: '10:00' }));
        expect(onSelectTime).toHaveBeenCalledWith('10:00');
    });
});
