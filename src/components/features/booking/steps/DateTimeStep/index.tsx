'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { BOOKING_COLUMN_HEADING, BOOKING_MONTH_NAMES } from '../../constants';
import { BookingMonthCalendar } from '../../components/BookingMonthCalendar';
import { BookingTimeSlotsSection } from '../../components/BookingTimeSlotsSection';
import { calendarGridDays } from '@/utils/calendarGrid';

import type { DateTimeStepProps } from '@/types/booking';

export function DateTimeStep({
    accentColor,
    staffMembers,
    staffMemberId,
    onStaffChange,
    calendarMonth,
    onCalendarMonthChange,
    bookingDate,
    onSelectDate,
    customerTime,
    onSelectTime,
    daySlots,
    todayStart,
    dayHasAvailability,
    onBack,
    onNext,
}: Readonly<DateTimeStepProps>) {
    const cells = calendarGridDays(calendarMonth);

    return (
        <>
            {staffMembers.length > 1 ? (
                <FormControl fullWidth size="small" className="mb-4 max-w-xs">
                    <InputLabel id="booking-staff-label">Profissional</InputLabel>
                    <Select
                        labelId="booking-staff-label"
                        label="Profissional"
                        value={staffMemberId}
                        onChange={(e) => onStaffChange(e.target.value)}
                    >
                        {staffMembers.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                                {m.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : null}
            <h3 className={BOOKING_COLUMN_HEADING}>Selecione data e horário</h3>
            <div className="mt-4 flex items-center justify-between gap-2">
                <button
                    type="button"
                    aria-label="Mês anterior"
                    className="rounded p-1 hover:bg-gray-100"
                    onClick={() =>
                        onCalendarMonthChange(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                        )
                    }
                >
                    ‹
                </button>
                <span className="text-sm font-semibold text-custom-black-200">
                    {BOOKING_MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </span>
                <button
                    type="button"
                    aria-label="Próximo mês"
                    className="rounded p-1 hover:bg-gray-100"
                    onClick={() =>
                        onCalendarMonthChange(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                        )
                    }
                >
                    ›
                </button>
            </div>
            <BookingMonthCalendar
                accentColor={accentColor}
                cells={cells}
                todayStart={todayStart}
                bookingDate={bookingDate}
                isDaySelectable={dayHasAvailability}
                onSelectDate={onSelectDate}
            />

            {bookingDate ? (
                <div className="mt-6">
                    <p className="text-sm font-medium text-custom-black-200">
                        Escolha um horário disponível —{' '}
                        {bookingDate.toLocaleDateString('pt-BR', {
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <BookingTimeSlotsSection
                        accentColor={accentColor}
                        daySlots={daySlots}
                        customerTime={customerTime}
                        onSelectTime={onSelectTime}
                    />
                </div>
            ) : (
                <p className="mt-6 text-sm text-custom-black-600">
                    Selecione um dia com indicador verde para ver os horários.
                </p>
            )}

            <div className="mt-auto flex justify-between gap-4 pt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm font-medium text-custom-black-600 hover:text-custom-black-200"
                >
                    ← De volta
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded px-5 py-2.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                >
                    Próximo →
                </button>
            </div>
        </>
    );
}
