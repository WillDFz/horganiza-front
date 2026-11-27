'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    buildBookingLineItems,
    computeTotalDurationMinutes,
    computeTotalPrice,
    findExtrasSelected,
    findPrimaryService,
} from '@/components/features/booking/utils/bookingSelections';
import {
    buildDaySlotsFromApi,
    dayHasAvailability,
    getStaffDayMeta,
    isSelectedScheduleSlot,
} from '@/components/features/booking/utils/bookingSchedule';
import { getBookingAccentColor } from '@/components/features/booking/utils/getBookingAccentColor';
import { useAuth } from '@/contexts/auth-context';
import { useAppointments } from '@/hooks/useAppointments';
import { useService } from '@/hooks/useService';
import { useStaff } from '@/hooks/useStaff';
import { startOfLocalDay } from '@/utils/formatters/date';
import { localDateToYyyyMmDd } from '@/utils/formatters/scheduleTime';
import { stripPhoneDigits } from '@/utils/formatters/phoneBr';

import { useBookingNavigation } from './useBookingNavigation';
import { useBookingSubmit } from './useBookingSubmit';

import type { UseCustomerBookingWizardOptions } from '@/types/booking';
import type { BookingDaySlots } from '@/types/booking';

export type { UseCustomerBookingWizardOptions } from '@/types/booking';

const EMPTY_DAY_SLOTS: BookingDaySlots = {
    isDayActive: false,
    availableSlots: [],
    displayRange: null,
    serviceExceedsWindow: false,
};

export function useCustomerBookingWizard({ business, onBooked }: UseCustomerBookingWizardOptions) {
    const accentColor = getBookingAccentColor(business?.primary_color);
    const { user } = useAuth();
    const { getServices, services, loading: servicesLoading } = useService();
    const { getStaffMembers, staffMembers, loading: staffLoading, getAvailableAppointmentRange } =
        useStaff();
    const { createAppointment } = useAppointments();

    const [primaryServiceId, setPrimaryServiceId] = useState<string | null>(null);
    const [extraIds, setExtraIds] = useState<string[]>([]);
    const [staffMemberId, setStaffMemberId] = useState('');
    const [calendarMonth, setCalendarMonth] = useState(() => new Date());
    const [bookingDate, setBookingDate] = useState<Date | null>(null);
    const [customerTime, setCustomerTime] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneDigits, setPhoneDigits] = useState('');
    const [loadedDaySlots, setLoadedDaySlots] = useState<BookingDaySlots>(EMPTY_DAY_SLOTS);

    useEffect(() => {
        void getServices();
        void getStaffMembers();
    }, [getServices, getStaffMembers]);

    const userName = user?.name;
    const userNameParts = (() => {
        if (!userName) return { first: '', last: '' };
        const parts = userName.trim().split(/\s+/);
        return { first: parts[0] ?? '', last: parts.slice(1).join(' ') };
    })();

    const userPhoneDigits = stripPhoneDigits(user?.phone ?? '');

    const resolvedFirstName = firstName || userNameParts.first;
    const resolvedLastName = lastName || userNameParts.last;
    const resolvedPhoneDigits = phoneDigits || userPhoneDigits;

    const effectiveStaffMemberId = staffMemberId || staffMembers[0]?.id || '';

    const primary = useMemo(
        () => findPrimaryService(services, primaryServiceId),
        [services, primaryServiceId],
    );

    const extrasSelected = useMemo(
        () => findExtrasSelected(services, extraIds),
        [services, extraIds],
    );

    const totalDurationMinutes = useMemo(
        () => computeTotalDurationMinutes(primary, extrasSelected),
        [primary, extrasSelected],
    );

    const totalPrice = useMemo(
        () => computeTotalPrice(primary, extrasSelected),
        [primary, extrasSelected],
    );

    const lineItems = useMemo(
        () => buildBookingLineItems(primary, extrasSelected),
        [primary, extrasSelected],
    );

    const selectedStaff = useMemo(
        () => staffMembers.find((s) => s.id === effectiveStaffMemberId) ?? null,
        [staffMembers, effectiveStaffMemberId],
    );

    const staticDaySlots = useMemo((): BookingDaySlots | null => {
        if (!bookingDate || !selectedStaff || totalDurationMinutes <= 0) {
            return EMPTY_DAY_SLOTS;
        }

        const meta = getStaffDayMeta(bookingDate, selectedStaff, totalDurationMinutes);

        if (!meta.isDayActive || meta.serviceExceedsWindow) {
            return meta;
        }

        return null;
    }, [bookingDate, selectedStaff, totalDurationMinutes]);

    useEffect(() => {
        if (staticDaySlots !== null) return;

        if (!bookingDate || !selectedStaff || totalDurationMinutes <= 0) return;

        const meta = getStaffDayMeta(bookingDate, selectedStaff, totalDurationMinutes);
        let cancelled = false;

        void (async () => {
            try {
                const apiSlots = await getAvailableAppointmentRange({
                    staff: selectedStaff.id,
                    date: localDateToYyyyMmDd(bookingDate),
                    duration: totalDurationMinutes,
                });
                if (cancelled) return;
                setLoadedDaySlots(buildDaySlotsFromApi(apiSlots, meta, bookingDate));
            } catch {
                if (cancelled) return;
                setLoadedDaySlots({ ...meta, availableSlots: [] });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [staticDaySlots, bookingDate, selectedStaff, totalDurationMinutes, getAvailableAppointmentRange]);

    const daySlots = staticDaySlots ?? loadedDaySlots;

    const effectiveCustomerTime =
        customerTime && isSelectedScheduleSlot(customerTime, daySlots.availableSlots)
            ? customerTime
            : '';

    const todayStart = useMemo(() => startOfLocalDay(new Date()), []);

    const checkDayHasAvailability = useCallback(
        (date: Date) => dayHasAvailability(date, selectedStaff, totalDurationMinutes),
        [selectedStaff, totalDurationMinutes],
    );

    const navigation = useBookingNavigation({
        primaryServiceId,
        bookingDate,
        customerTime: effectiveCustomerTime,
        daySlots,
        setExtraIds,
        setPrimaryServiceId,
        setBookingDate,
        setCustomerTime,
        setCalendarMonth,
    });

    const { submitting, handleSubmit } = useBookingSubmit({
        business,
        primary,
        selectedStaff,
        bookingDate,
        customerTime: effectiveCustomerTime,
        daySlots,
        firstName: resolvedFirstName,
        lastName: resolvedLastName,
        phoneDigits: resolvedPhoneDigits,
        extrasSelected,
        userId: user?.id,
        createAppointment,
        onBooked,
        resetWizard: navigation.resetWizard,
    });

    const selectPrimaryService = useCallback((id: string) => {
        setPrimaryServiceId(id);
        setExtraIds((prev) => prev.filter((x) => x !== id));
    }, []);

    const toggleExtra = useCallback((id: string) => {
        setExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, []);

    const selectBookingDate = useCallback((date: Date) => {
        setBookingDate(date);
        setCustomerTime('');
    }, []);

    const loading = servicesLoading || staffLoading;

    return {
        accentColor,
        loading,
        submitting,
        step: navigation.step,
        services,
        staffMembers,
        user,
        business,
        primaryServiceId,
        extraIds,
        staffMemberId: effectiveStaffMemberId,
        calendarMonth,
        bookingDate,
        customerTime: effectiveCustomerTime,
        firstName: resolvedFirstName,
        lastName: resolvedLastName,
        phoneDigits: resolvedPhoneDigits,
        primary,
        extrasSelected,
        totalPrice,
        totalDurationMinutes,
        lineItems,
        daySlots,
        todayStart,
        setStaffMemberId,
        setCalendarMonth,
        selectBookingDate,
        setCustomerTime,
        setFirstName,
        setLastName,
        setPhoneDigits,
        selectPrimaryService,
        toggleExtra,
        goNextFromService: navigation.goNextFromService,
        goNextFromExtras: navigation.goNextFromExtras,
        goNextFromDatetime: navigation.goNextFromDatetime,
        setStep: navigation.setStep,
        handleSubmit,
        dayHasAvailability: checkDayHasAvailability,
        resetWizard: navigation.resetWizard,
    };
}

export type CustomerBookingWizardState = ReturnType<typeof useCustomerBookingWizard>;
