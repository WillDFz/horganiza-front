'use client';

import { BOOKING_WEEK_LETTERS } from '../../constants';
import { isSameLocalDay } from '@/utils/formatters/date';

import type { CalendarCell } from '@/utils/calendarGrid';

export interface BookingMonthCalendarProps {
    accentColor: string;
    cells: CalendarCell[];
    todayStart: Date;
    bookingDate: Date | null;
    isDaySelectable: (date: Date) => boolean;
    onSelectDate: (date: Date) => void;
}

export function BookingMonthCalendar({
    accentColor,
    cells,
    todayStart,
    bookingDate,
    isDaySelectable,
    onSelectDate,
}: Readonly<BookingMonthCalendarProps>) {
    const renderDayIndicator = (selectable: boolean, inMonth: boolean, past: boolean) => {
        if (selectable) {
            return (
                <span
                    className="mt-0.5 h-0.5 w-5 rounded-full bg-green-500"
                    aria-hidden
                />
            );
        }

        if (inMonth && !past) {
            return <span className="mt-0.5 h-0.5 w-5" aria-hidden />;
        }

        return null;
    };

    return (
        <>
            <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-xs font-semibold text-custom-black-600">
                {BOOKING_WEEK_LETTERS.map((w) => (
                    <div key={w}>{w}</div>
                ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-y-1">
                {cells.map((cell, idx) => {
                    const { date, inMonth } = cell;
                    const past = date < todayStart;
                    const selectable = inMonth && !past && isDaySelectable(date);
                    const selected = bookingDate !== null && isSameLocalDay(date, bookingDate);

                    return (
                        <button
                            key={`${date.getTime()}-${idx}`}
                            type="button"
                            disabled={!selectable}
                            onClick={() => onSelectDate(date)}
                            className={`
                                flex flex-col items-center justify-center py-2 text-sm
                                ${!inMonth ? 'pointer-events-none text-transparent' : ''}
                                ${inMonth && past ? 'cursor-not-allowed text-gray-300' : ''}
                                ${inMonth && !past && !selectable ? 'cursor-not-allowed text-gray-400' : ''}
                                ${
                                    selectable
                                        ? 'cursor-pointer rounded text-custom-black-200 hover:bg-gray-50'
                                        : ''
                                }
                                ${selected ? 'rounded font-semibold text-white' : ''}
                            `}
                            style={selected ? { backgroundColor: accentColor } : undefined}
                        >
                            <span>{inMonth ? date.getDate() : ''}</span>
                            {renderDayIndicator(selectable, inMonth, past)}
                        </button>
                    );
                })}
            </div>
        </>
    );
}
