'use client';

import React, { useCallback, useEffect, useState } from 'react';
import CalendarComponent from '@/components/ui/Calendar';
import LoadingState from '@/components/ui/LoadingState';
import PageHeader from '@/components/ui/PageHeader';
import { useAuth } from '@/contexts/auth-context';
import { useAppointments } from '@/hooks/useAppointments';

const AppointmentsPage = () => {
    const { appointments, loading, getMyAppointments } = useAppointments();
    const { user } = useAuth();
    const businessId = user?.business_id;

    const handleRefresh = useCallback(async () => {
        if (!businessId) return;
        await getMyAppointments(businessId);
    }, [getMyAppointments, businessId]);

    useEffect(() => {
        if (!businessId) return;

        void getMyAppointments(businessId);
    }, [getMyAppointments, businessId]);

    const getMonthName = (date: Date) => {
        const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    };

    const [currentMonth, setCurrentMonth] = useState<string>(getMonthName(new Date()));

    const handleDateChange = (date: Date) => {
        setCurrentMonth(getMonthName(date));
    };

    return (
        <div>
            <PageHeader title="Agendamentos" description={currentMonth} />
            {loading ? (
                <LoadingState />
            ) : (
                <CalendarComponent
                    appointments={appointments}
                    onDateChange={handleDateChange}
                    onRefresh={handleRefresh}
                />
            )}
        </div>
    );
};

export default AppointmentsPage;
