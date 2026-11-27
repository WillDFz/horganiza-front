import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { BookingScheduleSlotSelect } from './index';

describe('BookingScheduleSlotSelect', () => {
    const slots = [
        {
            init: '2026-06-24T09:00:00.000Z',
            end: '2026-06-24T09:30:00.000Z',
        },
        {
            init: '2026-06-24T10:00:00.000Z',
            end: '2026-06-24T10:30:00.000Z',
        },
    ];

    it('renderiza opções de horário da API', async () => {
        const user = userEvent.setup();

        render(
            <BookingScheduleSlotSelect
                availableSlots={slots}
                selectedTime=""
                onSelectTime={jest.fn()}
            />,
        );

        await user.click(screen.getByLabelText(/horário/i));
        expect(screen.getByText('09:00 – 09:30')).toBeInTheDocument();
        expect(screen.getByText('10:00 – 10:30')).toBeInTheDocument();
    });

    it('propaga horário selecionado', async () => {
        const user = userEvent.setup();
        const onSelectTime = jest.fn();

        render(
            <BookingScheduleSlotSelect
                availableSlots={slots}
                selectedTime=""
                onSelectTime={onSelectTime}
            />,
        );

        await user.click(screen.getByLabelText(/horário/i));
        await user.click(screen.getByText('09:00 – 09:30'));
        expect(onSelectTime).toHaveBeenCalledWith('09:00');
    });
});
