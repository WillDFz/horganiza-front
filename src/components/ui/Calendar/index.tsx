'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    KeyboardDoubleArrowLeft,
    KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { Appointment } from '@/types/api/appointments.types';
import AppointmentDetailsModal from '@/components/ui/AppointmentDetailsModal';
import BaseModal from '@/components/ui/BaseModal';
import { useAppointmentDetailsActions } from '@/hooks/useAppointmentDetailsActions';
import { APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABEL } from '@/styles/tokens';

interface CalendarComponentProps {
    appointments: Appointment[];
    onEventClick?: (appointment: Appointment) => void;
    onDateChange?: (date: Date) => void;
    onRefresh?: () => void | Promise<void>;
}

type ModalView = 'day-list' | 'details';

type CalendarDayInfo = { date: Date; isCurrentMonth: boolean };

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function toLocalDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function parseScheduleTime(appointment: Appointment): Date | null {
    const { schedule_time } = appointment;

    if (schedule_time instanceof Date) {
        return schedule_time;
    }
    if (typeof schedule_time === 'string') {
        const parsed = new Date(schedule_time);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
}

function sortAppointmentsByScheduleTime(items: Appointment[]): Appointment[] {
    return [...items].sort((a, b) => {
        const timeA = parseScheduleTime(a)?.getTime() ?? 0;
        const timeB = parseScheduleTime(b)?.getTime() ?? 0;
        return timeA - timeB;
    });
}

function formatTimeShortPtBr(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }
    return new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(date);
}

function buildCalendarDays(currentDate: Date): CalendarDayInfo[] {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayWeek = firstDay.getDay();

    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    const days: CalendarDayInfo[] = [];

    for (let i = firstDayWeek - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, daysInPrevMonth - i),
            isCurrentMonth: false,
        });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        days.push({
            date: new Date(year, month, day),
            isCurrentMonth: true,
        });
    }

    const remainingDays = 42 - days.length;

    for (let day = 1; day <= remainingDays; day++) {
        days.push({
            date: new Date(year, month + 1, day),
            isCurrentMonth: false,
        });
    }

    return days;
}

function groupAppointmentsByDate(appointments: Appointment[]): Record<string, Appointment[]> {
    const grouped: Record<string, Appointment[]> = {};

    appointments.forEach((appointment) => {
        const scheduleTime = parseScheduleTime(appointment);
        if (!scheduleTime) {
            return;
        }

        const dateKey = toLocalDateKey(scheduleTime);

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }

        grouped[dateKey].push(appointment);
    });

    return grouped;
}

function isSameCalendarDay(date: Date): boolean {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

function formatDayAriaLabel(date: Date): string {
    return `${date.getDate()} de ${monthNames[date.getMonth()]} de ${date.getFullYear()}`;
}

function shiftMonth(date: Date, direction: 'prev' | 'next'): Date {
    const newDate = new Date(date);
    const delta = direction === 'prev' ? -1 : 1;
    newDate.setMonth(date.getMonth() + delta);
    return newDate;
}

function shiftYear(date: Date, direction: 'prev' | 'next'): Date {
    const newDate = new Date(date);
    const delta = direction === 'prev' ? -1 : 1;
    newDate.setFullYear(date.getFullYear() + delta);
    return newDate;
}

type CalendarDayCellProps = Readonly<{
    dayInfo: CalendarDayInfo;
    dayAppointments: Appointment[];
    onDayClick: (date: Date) => void;
    onAppointmentClick: (appointment: Appointment, event: React.MouseEvent) => void;
}>;

function CalendarDayCell({
    dayInfo,
    dayAppointments,
    onDayClick,
    onAppointmentClick,
}: CalendarDayCellProps) {
    const isCurrentDay = isSameCalendarDay(dayInfo.date);
    const visibleAppointments = dayAppointments.slice(0, 3);
    const overflowCount = dayAppointments.length - 3;

    return (
        <div
            className={`
                relative min-h-[100px] p-2 border-r border-b border-gray-200
                ${dayInfo.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isCurrentDay ? 'ring-2 ring-primary ring-inset' : ''}
            `}
        >
            <button
                type="button"
                onClick={() => onDayClick(dayInfo.date)}
                aria-label={`Ver agendamentos em ${formatDayAriaLabel(dayInfo.date)}`}
                className={`
                    absolute inset-0 w-full h-full p-2 text-left
                    cursor-pointer transition-colors
                    ${dayInfo.isCurrentMonth ? 'hover:bg-gray-50' : 'hover:bg-gray-100'}
                `}
            />
            <div className="relative z-10 pointer-events-none">
                <div
                    className={`
                        text-sm font-medium mb-1
                        ${dayInfo.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                        ${isCurrentDay ? 'text-primary font-bold' : ''}
                    `}
                >
                    {dayInfo.date.getDate()}
                </div>

                <div className="space-y-1">
                    {visibleAppointments.map((appointment) => (
                        <button
                            key={appointment.id}
                            type="button"
                            onClick={(event) => onAppointmentClick(appointment, event)}
                            className="pointer-events-auto block w-full text-left text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                            style={{
                                backgroundColor: APPOINTMENT_STATUS_COLORS[appointment.status],
                                color: 'white',
                            }}
                            aria-label={`${appointment.customer_name}, ${appointment.status}`}
                            title={`${appointment.customer_name} - ${appointment.status}`}
                        >
                            {appointment.customer_name}
                        </button>
                    ))}
                    {overflowCount > 0 ? (
                        <div className="text-xs text-gray-500 font-medium">
                            +{overflowCount} mais
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

type CalendarDayListModalContentProps = Readonly<{
    selectedDate: Date;
    appointments: Appointment[];
    onAppointmentClick: (appointment: Appointment) => void;
    onClose: () => void;
}>;

function CalendarDayListModalContent({
    selectedDate,
    appointments,
    onAppointmentClick,
    onClose,
}: CalendarDayListModalContentProps) {
    const title = `Agendamentos em ${formatDayAriaLabel(selectedDate)}`;

    return (
        <div className="flex flex-col gap-4 p-2" data-testid="calendar-day-list-modal">
            <Typography variant="h6" component="h2">
                {title}
            </Typography>

            {appointments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Nenhum agendamento neste dia.
                </Typography>
            ) : (
                <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            <button
                                type="button"
                                onClick={() => onAppointmentClick(appointment)}
                                className="w-full text-left rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
                                data-testid={`calendar-day-appointment-${appointment.id}`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium text-gray-900">
                                        {appointment.customer_name}
                                    </span>
                                    <span
                                        className="text-xs font-medium px-2 py-0.5 rounded text-white shrink-0"
                                        style={{
                                            backgroundColor: APPOINTMENT_STATUS_COLORS[appointment.status],
                                        }}
                                    >
                                        {APPOINTMENT_STATUS_LABEL[appointment.status]}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {formatTimeShortPtBr(appointment.schedule_time)}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <Button variant="contained" onClick={onClose} fullWidth>
                Fechar
            </Button>
        </div>
    );
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
    appointments,
    onEventClick,
    onDateChange,
    onRefresh,
}) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [modalView, setModalView] = useState<ModalView>('day-list');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        onDateChange?.(currentDate);
    }, [currentDate, onDateChange]);

    const calendarDays = useMemo(() => buildCalendarDays(currentDate), [currentDate]);

    const appointmentsByDate = useMemo(
        () => groupAppointmentsByDate(appointments),
        [appointments],
    );

    const selectedDayAppointments = useMemo(() => {
        if (!selectedDate) {
            return [];
        }
        const dateKey = toLocalDateKey(selectedDate);
        return sortAppointmentsByScheduleTime(appointmentsByDate[dateKey] ?? []);
    }, [appointmentsByDate, selectedDate]);

    const navigateMonth = useCallback((direction: 'prev' | 'next') => {
        setCurrentDate((prev) => shiftMonth(prev, direction));
    }, []);

    const navigateYear = useCallback((direction: 'prev' | 'next') => {
        setCurrentDate((prev) => shiftYear(prev, direction));
    }, []);

    const goToToday = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    const openDayListModal = useCallback((date: Date) => {
        setModalView('day-list');
        setSelectedDate(date);
        setSelectedAppointment(null);
    }, []);

    const openDetailsModal = useCallback((appointment: Appointment) => {
        setModalView('details');
        setSelectedAppointment(appointment);
    }, []);

    const handleDayClick = useCallback((date: Date) => {
        openDayListModal(date);
    }, [openDayListModal]);

    const handleCloseModal = useCallback(() => {
        setSelectedAppointment(null);
        setSelectedDate(null);
        setModalView('day-list');
    }, []);

    const handleAppointmentDetailsSuccess = useCallback(
        (action: 'status-change' | 'delete' | 'cancel', appointment: Appointment) => {
            if (action === 'status-change') {
                setSelectedAppointment((prev) =>
                    prev ? { ...prev, status: appointment.status } : null,
                );
                return;
            }

            handleCloseModal();
        },
        [handleCloseModal],
    );

    const { loading: isActionPending, updateStatus, deleteAppointment } = useAppointmentDetailsActions({
        appointment: selectedAppointment,
        mode: 'staff',
        onRefresh,
        onSuccess: onRefresh ? handleAppointmentDetailsSuccess : undefined,
    });

    const monthYearLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    const showDayListModal = modalView === 'day-list' && selectedDate !== null;
    const showDetailsModal = modalView === 'details' && selectedAppointment !== null;

    const handleAppointmentClick = useCallback(
        (appointment: Appointment, event: React.MouseEvent) => {
            event.stopPropagation();
            if (onEventClick) {
                onEventClick(appointment);
                return;
            }
            setSelectedDate(null);
            openDetailsModal(appointment);
        },
        [onEventClick, openDetailsModal],
    );

    const handleDayListAppointmentClick = useCallback(
        (appointment: Appointment) => {
            if (onEventClick) {
                onEventClick(appointment);
                handleCloseModal();
                return;
            }
            setModalView('details');
            setSelectedAppointment(appointment);
        },
        [onEventClick, handleCloseModal],
    );

    const handleBackToDayList = useCallback(() => {
        setModalView('day-list');
        setSelectedAppointment(null);
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateYear('prev')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Ano anterior"
                        data-testid="calendar-prev-year"
                    >
                        <KeyboardDoubleArrowLeft />
                    </button>
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Mês anterior"
                        data-testid="calendar-prev-month"
                    >
                        <ChevronLeft />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">{monthYearLabel}</h2>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        aria-label="Ir para hoje"
                        data-testid="calendar-today"
                    >
                        Hoje
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigateMonth('next')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Próximo mês"
                        data-testid="calendar-next-month"
                    >
                        <ChevronRight />
                    </button>
                    <button
                        onClick={() => navigateYear('next')}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label="Próximo ano"
                        data-testid="calendar-next-year"
                    >
                        <KeyboardDoubleArrowRight />
                    </button>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="p-3 text-center text-sm font-semibold text-gray-700"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {calendarDays.map((dayInfo, index) => {
                        const dateKey = toLocalDateKey(dayInfo.date);
                        const dayAppointments = appointmentsByDate[dateKey] ?? [];

                        return (
                            <CalendarDayCell
                                key={`${dateKey}-${index}`}
                                dayInfo={dayInfo}
                                dayAppointments={dayAppointments}
                                onDayClick={handleDayClick}
                                onAppointmentClick={handleAppointmentClick}
                            />
                        );
                    })}
                </div>
            </div>

            <BaseModal
                open={showDayListModal}
                onClose={handleCloseModal}
                size="md"
                className="mt-24 outline-none"
            >
                {selectedDate ? (
                    <CalendarDayListModalContent
                        selectedDate={selectedDate}
                        appointments={selectedDayAppointments}
                        onAppointmentClick={handleDayListAppointmentClick}
                        onClose={handleCloseModal}
                    />
                ) : null}
            </BaseModal>

            <AppointmentDetailsModal
                open={showDetailsModal}
                appointment={selectedAppointment}
                onClose={() => {
                    if (selectedDate) {
                        handleBackToDayList();
                        return;
                    }
                    handleCloseModal();
                }}
                loading={isActionPending}
                onDelete={onRefresh ? deleteAppointment : undefined}
                onStatusChange={onRefresh ? updateStatus : undefined}
            />
        </div>
    );
};

export default CalendarComponent;
