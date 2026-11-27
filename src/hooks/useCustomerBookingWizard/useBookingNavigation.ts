'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { isSelectedScheduleSlot } from '@/components/features/booking/utils/bookingSchedule';

import type { BookingWizardStep, UseBookingNavigationOptions } from '@/types/booking';

export function useBookingNavigation({
    primaryServiceId,
    bookingDate,
    customerTime,
    daySlots,
    setExtraIds,
    setPrimaryServiceId,
    setBookingDate,
    setCustomerTime,
    setCalendarMonth,
}: UseBookingNavigationOptions) {
    const [step, setStep] = useState<BookingWizardStep>('service');

    const resetWizard = useCallback(() => {
        setStep('service');
        setPrimaryServiceId(null);
        setExtraIds([]);
        setBookingDate(null);
        setCustomerTime('');
        setCalendarMonth(new Date());
    }, [
        setExtraIds,
        setPrimaryServiceId,
        setBookingDate,
        setCustomerTime,
        setCalendarMonth,
    ]);

    const goNextFromService = useCallback(() => {
        if (!primaryServiceId) return;
        setExtraIds((prev) => prev.filter((id) => id !== primaryServiceId));
        setStep('extras');
    }, [primaryServiceId, setExtraIds]);

    const goNextFromExtras = useCallback(() => setStep('datetime'), []);

    const goNextFromDatetime = useCallback(() => {
        if (!bookingDate || !customerTime) {
            toast.error('Selecione data e horário');
            return;
        }
        if (!isSelectedScheduleSlot(customerTime, daySlots.availableSlots)) {
            toast.error('Selecione um horário válido');
            return;
        }
        setStep('customer');
    }, [bookingDate, customerTime, daySlots.availableSlots]);

    return {
        step,
        setStep,
        resetWizard,
        goNextFromService,
        goNextFromExtras,
        goNextFromDatetime,
    };
}
