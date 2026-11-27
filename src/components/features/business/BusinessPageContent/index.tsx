'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chip, CircularProgress } from '@mui/material';
import {
    ChevronRight,
    HistoryOutlined,
    LogoutOutlined,
    PersonOutlined,
} from '@mui/icons-material';
import { CustomerBookingWizard } from '@/components/features/booking';
import AppointmentDetailsModal from '@/components/ui/AppointmentDetailsModal';
import { useAuth } from '@/contexts/auth-context';
import { useAppointmentDetailsActions } from '@/hooks/useAppointmentDetailsActions';
import { useAppointments } from '@/hooks/useAppointments';
import { useBusiness } from '@/hooks/useBusiness';
import { useService } from '@/hooks/useService';
import { Appointment } from '@/types/api/appointments.types';
import { Business } from '@/types/api/business.types';
import { formatDateTimeFullPtBr, formatUpcomingScheduleDisplayPtBr } from '@/utils/formatters/date';

import { APPOINTMENT_STATUS_LABEL } from '@/styles/tokens';

const APPOINTMENT_STATUS_CHIP_COLOR: Record<
    Appointment['status'],
    'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
    SCHEDULED: 'default',
    CONFIRMED: 'success',
    COMPLETED: 'info',
    CANCELLED: 'error',
};

export interface BusinessPageContentProps {
    slug: string;
}

const BusinessPageContent = ({ slug }: BusinessPageContentProps) => {
    const { getUserSession, loading: authLoading, logout } = useAuth();
    const { getBusinessBySlug, loading } = useBusiness();
    const [businessInfo, setBusinessInfo] = useState<Business | null>(null);
    const { getMyAppointments, appointments } = useAppointments();
    const { getServices, services } = useService();

    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const handleRefreshAppointments = useCallback(async () => {
        if (!businessInfo?.id) return;
        await getMyAppointments(businessInfo.id);
    }, [businessInfo, getMyAppointments]);

    const { loading: isCancelling, cancelAppointment } = useAppointmentDetailsActions({
        appointment: selectedAppointment,
        mode: 'customer',
        onRefresh: businessInfo?.id ? handleRefreshAppointments : undefined,
        onSuccess: () => setSelectedAppointment(null),
    });

    const handleLogout = useCallback(() => {
        void logout(`/business/${slug}/auth/login`);
    }, [logout, slug]);

    const loadBusinessInfo = useCallback(async () => {
        await getUserSession();
        const business = await getBusinessBySlug(slug);
        setBusinessInfo(business);
        void getMyAppointments(business.id);
    }, [getBusinessBySlug, slug, getUserSession, getMyAppointments]);

    const [referenceTimeMs] = useState(() => Date.now());

    const upcomingAppointments = useMemo(() => {
        return [...appointments]
            .filter((a) => {
                const t = new Date(a.schedule_time).getTime();
                return !Number.isNaN(t) && t >= referenceTimeMs;
            })
            .sort(
                (a, b) =>
                    new Date(a.schedule_time).getTime() - new Date(b.schedule_time).getTime(),
            )
            .slice(0, 10);
    }, [appointments, referenceTimeMs]);

    useEffect(() => {
        queueMicrotask(() => {
            void loadBusinessInfo();
        });
    }, [loadBusinessInfo]);

    useEffect(() => {
        if (!businessInfo?.id) return;
        void getServices();
    }, [businessInfo?.id, getServices]);

    const serviceNameById = useMemo(() => {
        const map = new Map<string, string>();
        for (const s of services) {
            map.set(s.id, s.name);
        }
        return map;
    }, [services]);

    return (
        <>
            <div className="w-full rounded-lg bg-white p-8 shadow-md">
                {loading || authLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <h1 className="text-2xl font-bold">Bem-vindo ao {businessInfo?.name}</h1>
                            <div className="my-4 flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled
                                    title="Em breve"
                                    className="flex items-center gap-2 rounded-md bg-primary-100 px-4 py-2 text-white opacity-60 cursor-not-allowed"
                                >
                                    <PersonOutlined />
                                    <span>Perfil</span>
                                </button>
                                <button
                                    type="button"
                                    disabled
                                    title="Em breve"
                                    className="flex items-center gap-2 rounded-md bg-primary-100 px-4 py-2 text-white opacity-60 cursor-not-allowed"
                                >
                                    <HistoryOutlined />
                                    <span>Histórico</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-50"
                                >
                                    <LogoutOutlined fontSize="small" />
                                    <span>Sair</span>
                                </button>
                            </div>
                        </div>
                        <CustomerBookingWizard
                            business={businessInfo}
                            onBooked={() => {
                                void getMyAppointments(businessInfo?.id as string);
                            }}
                        />
                        {upcomingAppointments.length > 0 ? (
                            <section
                                className="mt-8 border-t border-gray-200 pt-6"
                                aria-labelledby="upcoming-heading"
                            >
                                <h2 id="upcoming-heading" className="text-lg font-semibold text-gray-900">
                                    Seus próximos agendamentos
                                </h2>
                                <p className="mt-1 max-w-xl text-sm text-gray-600">
                                    Veja o serviço, o horário e o status. Toque em um cartão para abrir os detalhes
                                    completos.
                                </p>
                                <ul className="mt-4 flex flex-col gap-3">
                                    {upcomingAppointments.map((a) => {
                                        const display = formatUpcomingScheduleDisplayPtBr(a.schedule_time, referenceTimeMs);
                                        const serviceTitle =
                                            serviceNameById.get(a.service_id) ?? 'Serviço agendado';
                                        const accent =
                                            businessInfo?.primary_color?.trim() ?? 'var(--color-primary-100, #2563eb)';
                                        const scheduleLabel = display
                                            ? `${display.dayLabel} às ${display.timeLabel}`
                                            : formatDateTimeFullPtBr(a.schedule_time);
                                        const appointmentAriaLabel = `Abrir detalhes: ${serviceTitle}, ${scheduleLabel}`;

                                        return (
                                            <li key={a.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedAppointment(a)}
                                                    className="flex w-full items-stretch gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-100"
                                                    aria-label={appointmentAriaLabel}
                                                >
                                                    <div
                                                        className="flex w-[5px] shrink-0"
                                                        style={{ backgroundColor: accent }}
                                                        aria-hidden
                                                    />
                                                    <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
                                                        <div className="flex min-w-22 shrink-0 flex-col border-r border-gray-100 pr-3 text-center sm:min-w-26 sm:text-left">
                                                            {display ? (
                                                                <>
                                                                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                                        {display.dayLabel}
                                                                    </span>
                                                                    <span className="text-xl font-bold tabular-nums text-gray-900">
                                                                        {display.timeLabel}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-sm text-gray-600">
                                                                    {formatDateTimeFullPtBr(a.schedule_time)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate font-medium text-gray-900">
                                                                {serviceTitle}
                                                            </p>
                                                            {display?.hint ? (
                                                                <p className="mt-0.5 text-sm text-gray-500">
                                                                    {display.hint}
                                                                </p>
                                                            ) : null}
                                                            <div className="mt-2">
                                                                <Chip
                                                                    label={APPOINTMENT_STATUS_LABEL[a.status]}
                                                                    color={APPOINTMENT_STATUS_CHIP_COLOR[a.status]}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </div>
                                                        </div>
                                                        <ChevronRight
                                                            className="size-6 shrink-0 self-center text-gray-400"
                                                            aria-hidden
                                                        />
                                                    </div>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ) : null}
                    </>
                )}
            </div>

            <AppointmentDetailsModal
                open={selectedAppointment !== null}
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                loading={isCancelling}
                onCancel={businessInfo?.id ? cancelAppointment : undefined}
            />
        </>
    );
};

export default BusinessPageContent;
