'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
    BusinessOutlined,
    EventOutlined,
    PersonOutlined,
    BuildOutlined,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/auth-context';
import { useAppointments } from '@/hooks/useAppointments';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import PageHeader from '@/components/ui/PageHeader';
import { APPOINTMENT_STATUS_BADGE_VARIANT, APPOINTMENT_STATUS_LABEL } from '@/styles/tokens';
import { formatDateTimeFullPtBr } from '@/utils/formatters/date';

const shortcuts = [
    { label: 'Agendamentos', href: '/dashboard/appointments', icon: EventOutlined },
    { label: 'Serviços', href: '/dashboard/services', icon: BuildOutlined },
    { label: 'Atendentes', href: '/dashboard/staff', icon: PersonOutlined },
    { label: 'Meu Negócio', href: '/dashboard/business', icon: BusinessOutlined },
] as const;

const DashboardHome = () => {
    const { getMyAppointments, appointments, loading: appointmentsLoading } = useAppointments();
    const { user } = useAuth();
    const businessId = user?.business_id;

    useEffect(() => {
        if (!businessId) return;

        void getMyAppointments(businessId);
    }, [getMyAppointments, businessId]);

    // eslint-disable-next-line react-hooks/purity -- filtro "futuros" depende do relógio atual
    const nowMs = Date.now();
    const upcomingAppointments = [...appointments]
        .filter((a) => {
            if (a.status === 'CANCELLED') return false;
            const t = new Date(a.schedule_time).getTime();
            return !Number.isNaN(t) && t >= nowMs;
        })
        .sort(
            (a, b) =>
                new Date(a.schedule_time).getTime() - new Date(b.schedule_time).getTime(),
        )
        .slice(0, 5);

    const isLoading = appointmentsLoading;

    const renderUpcomingAppointments = () => {
        if (isLoading) {
            return <LoadingState padding="sm" />;
        }

        if (upcomingAppointments.length === 0) {
            return (
                <p className="py-4 text-sm text-muted-foreground">
                    Nenhum agendamento futuro.{' '}
                    <Link href="/dashboard/appointments" className="font-medium text-primary hover:text-primary-600">
                        Ver calendário
                    </Link>
                </p>
            );
        }

        return (
            <ul className="flex flex-col gap-3">
                {upcomingAppointments.map((appointment) => (
                    <li
                        key={appointment.id}
                        className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <p className="font-medium text-foreground">
                                {appointment.customer_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatDateTimeFullPtBr(appointment.schedule_time)}
                            </p>
                        </div>
                        <Badge
                            variant={APPOINTMENT_STATUS_BADGE_VARIANT[appointment.status]}
                            className="self-start sm:self-center"
                        >
                            {APPOINTMENT_STATUS_LABEL[appointment.status]}
                        </Badge>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <PageHeader title="Painel" />

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {shortcuts.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 rounded-lg bg-surface p-4 shadow-md transition-shadow hover:shadow-lg"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-900 text-primary">
                            <Icon fontSize="small" />
                        </span>
                        <span className="font-medium text-foreground">{label}</span>
                    </Link>
                ))}
            </div>

            <Card aria-labelledby="upcoming-heading">
                <h2 id="upcoming-heading" className="mb-4 text-lg font-semibold text-foreground">
                    Próximos agendamentos
                </h2>

                {renderUpcomingAppointments()}

                {!isLoading && upcomingAppointments.length > 0 ? (
                    <Link
                        href="/dashboard/appointments"
                        className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-600"
                    >
                        Ver todos no calendário
                    </Link>
                ) : null}
            </Card>
        </div>
    );
};

export default DashboardHome;
