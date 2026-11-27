'use client';

import { BookingScheduleSlotSelect } from '../../components/BookingScheduleSlotSelect';

import type { BookingTimeSlotsSectionProps } from '@/types/booking';

export function BookingTimeSlotsSection({
    daySlots,
    customerTime,
    onSelectTime,
}: Readonly<BookingTimeSlotsSectionProps>) {
    if (!daySlots.isDayActive) {
        return (
            <p className="mt-2 text-sm text-amber-800">
                Este profissional não atende neste dia da semana.
            </p>
        );
    }

    if (daySlots.serviceExceedsWindow) {
        return (
            <p className="mt-2 text-sm text-amber-800">
                A combinação de serviços não cabe no expediente deste dia
                {daySlots.displayRange ? ` (${daySlots.displayRange})` : ''}.
            </p>
        );
    }

    if (daySlots.availableSlots.length === 0) {
        return (
            <p className="mt-2 text-sm text-amber-800">
                Não há horários disponíveis neste dia.
            </p>
        );
    }

    return (
        <BookingScheduleSlotSelect
            availableSlots={daySlots.availableSlots}
            selectedTime={customerTime}
            onSelectTime={onSelectTime}
        />
    );
}
