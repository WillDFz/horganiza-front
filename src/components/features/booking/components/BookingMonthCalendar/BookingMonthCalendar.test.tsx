import { fireEvent, render, screen } from '@testing-library/react';

import { BookingMonthCalendar } from './index';

describe('BookingMonthCalendar', () => {
    it('renderiza dias da semana e seleciona data disponível', () => {
        const onSelectDate = jest.fn();
        const date = new Date(2026, 4, 10);

        render(
            <BookingMonthCalendar
                accentColor="#333333"
                cells={[{ date, inMonth: true }]}
                todayStart={new Date(2026, 4, 1)}
                bookingDate={null}
                isDaySelectable={() => true}
                onSelectDate={onSelectDate}
            />,
        );

        fireEvent.click(screen.getByRole('button'));
        expect(onSelectDate).toHaveBeenCalledWith(date);
    });
});
