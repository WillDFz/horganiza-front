'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';

import { buildBookingNotes } from '@/components/features/booking/utils/buildBookingNotes';
import { isSelectedScheduleSlot } from '@/components/features/booking/utils/bookingSchedule';
import { datetimeLocalToIso, localDateToYyyyMmDd } from '@/utils/formatters/scheduleTime';

import type { UseBookingSubmitOptions } from '@/types/booking';

export function useBookingSubmit({
    business,
    primary,
    selectedStaff,
    bookingDate,
    customerTime,
    daySlots,
    firstName,
    lastName,
    phoneDigits,
    extrasSelected,
    userId,
    createAppointment,
    onBooked,
    resetWizard,
}: UseBookingSubmitOptions) {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (!business?.id || !primary || !selectedStaff || !bookingDate || !customerTime || !userId) {
                return;
            }
            if (!isSelectedScheduleSlot(customerTime, daySlots.availableSlots)) {
                toast.error('Selecione um horário válido');
                return;
            }
            const customerName = `${firstName.trim()} ${lastName.trim()}`.trim();
            if (!customerName) {
                toast.error('Informe nome e sobrenome');
                return;
            }

            const notes = buildBookingNotes(extrasSelected, phoneDigits);
            const schedule_time = datetimeLocalToIso(
                `${localDateToYyyyMmDd(bookingDate)}T${customerTime}`,
            );

            setSubmitting(true);
            try {
                await createAppointment({
                    id: '',
                    business_id: business.id,
                    staff_member_id: selectedStaff.id,
                    customer_id: userId,
                    service_id: primary.id,
                    status: 'SCHEDULED',
                    schedule_time,
                    customer_name: customerName,
                    notes: notes || undefined,
                    created_at: '',
                    updated_at: '',
                });
                toast.success('Agendamento criado com sucesso');
                onBooked?.();
                resetWizard();
            } catch {
                /* toast no hook useAppointments */
            } finally {
                setSubmitting(false);
            }
        },
        [
            business?.id,
            primary,
            selectedStaff,
            bookingDate,
            customerTime,
            userId,
            daySlots.availableSlots,
            firstName,
            lastName,
            phoneDigits,
            extrasSelected,
            createAppointment,
            onBooked,
            resetWizard,
        ],
    );

    return { submitting, handleSubmit };
}
