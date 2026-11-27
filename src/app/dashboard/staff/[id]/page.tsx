'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Tab, Tabs } from '@mui/material';
import TabContainer from '@/components/ui/TabContainer';
import StaffSchedule from '@/components/features/staff/Schedule';
import CalendarComponent from '@/components/ui/Calendar';
import { useAuth } from '@/contexts/auth-context';
import { useAppointments } from '@/hooks/useAppointments';
import StaffInfo from '@/components/features/staff/Info';
import { useStaff } from '@/hooks/useStaff';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import PageHeader from '@/components/ui/PageHeader';

const StaffMemberPage = () => {
    const { id } = useParams();
    const { getAppointmentsByStaff, appointments, loading } = useAppointments();
    const { user } = useAuth();
    const businessId = user?.business_id;
    const [activeTab, setActiveTab] = useState<number>(0);
    const { getStaffMemberById, staffMember } = useStaff();

    useEffect(() => {
        void getStaffMemberById(id as string);
    }, [getStaffMemberById, id]);

    useEffect(() => {
        if (id && activeTab === 2 && businessId) {
            getAppointmentsByStaff(id as string, businessId);
        }
    }, [id, activeTab, getAppointmentsByStaff, businessId]);

    const handleRefresh = useCallback(async () => {
        if (!businessId || typeof id !== 'string') return;
        await getAppointmentsByStaff(id, businessId);
    }, [getAppointmentsByStaff, id, businessId]);

    if (typeof id !== 'string' || !staffMember) {
        return <div>Não foi possível carregar a página</div>;
    }

    return (
        <div>
            <PageHeader title={staffMember.name} description="Detalhes do atendente" />

            <Card padding="sm" className="mb-4">
                <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} variant="scrollable">
                    <Tab value={0} label="Informações" />
                    <Tab value={1} label="Horários" />
                    <Tab value={2} label="Agendamentos" />
                </Tabs>
            </Card>

            <TabContainer value={activeTab} index={0} key="staff-information">
                <StaffInfo staffMember={staffMember} />
            </TabContainer>

            <TabContainer value={activeTab} index={1} key="staff-schedules">
                <StaffSchedule id={id} />
            </TabContainer>

            <TabContainer value={activeTab} index={2} key="staff-appointments">
                {loading ? (
                    <LoadingState />
                ) : (
                    <CalendarComponent
                        appointments={appointments}
                        onRefresh={handleRefresh}
                    />
                )}
            </TabContainer>
        </div>
    );
};

export default StaffMemberPage;
