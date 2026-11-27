'use client';

import { useState } from 'react';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Badge from '@/components/ui/Badge';
import BaseModal from '@/components/ui/BaseModal';
import Button from '@/components/ui/Button';
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog';
import { APPOINTMENT_STATUS_BADGE_VARIANT, APPOINTMENT_STATUS_LABEL } from '@/styles/tokens';
import { Appointment } from '@/types/api/appointments.types';
import { formatDateTimeFullPtBr } from '@/utils/formatters/date';

type AppointmentDetailsModalProps = Readonly<{
    open: boolean;
    appointment: Appointment | null;
    onClose: () => void;
    loading?: boolean;
    onDelete?: () => void | Promise<void>;
    onStatusChange?: (status: Appointment['status']) => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
}>;

function canChangeStatus(appointment: Appointment): boolean {
    return appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED';
}

function getConfirmAction(appointment: Appointment) {
    if (!canChangeStatus(appointment)) {
        return null;
    }

    if (appointment.status === 'SCHEDULED') {
        return { label: 'Confirmar', status: 'CONFIRMED' as const };
    }

    if (appointment.status === 'CONFIRMED') {
        return { label: 'Marcar como concluído', status: 'COMPLETED' as const };
    }

    return null;
}

type AppointmentDetailsHeaderProps = Readonly<{
    onClose: () => void;
    isActionPending: boolean;
}>;

function AppointmentDetailsHeader({ onClose, isActionPending }: AppointmentDetailsHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-foreground">Detalhes do agendamento</h2>
            <IconButton
                onClick={onClose}
                disabled={isActionPending}
                aria-label="Fechar"
                size="small"
            >
                <Close fontSize="small" />
            </IconButton>
        </div>
    );
}

type AppointmentDetailsBodyProps = Readonly<{
    appointment: Appointment;
}>;

function AppointmentDetailsBody({ appointment }: AppointmentDetailsBodyProps) {
    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Cliente</span>
                <span className="text-sm font-medium">{appointment.customer_name}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Data e hora</span>
                <span className="text-sm font-medium">
                    {formatDateTimeFullPtBr(appointment.schedule_time)}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className="w-fit" variant={APPOINTMENT_STATUS_BADGE_VARIANT[appointment.status]}>
                    {APPOINTMENT_STATUS_LABEL[appointment.status]}
                </Badge>
            </div>
            {appointment.notes ? (
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Observações</span>
                    <span className="whitespace-pre-wrap text-sm font-medium">{appointment.notes}</span>
                </div>
            ) : null}
        </div>
    );
}

type AppointmentDetailsFooterProps = Readonly<{
    appointment: Appointment;
    isActionPending: boolean;
    onDelete?: () => void | Promise<void>;
    onStatusChange?: (status: Appointment['status']) => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
    onDeleteClick: () => void;
}>;

function AppointmentDetailsFooter({
    appointment,
    isActionPending,
    onDelete,
    onStatusChange,
    onCancel,
    onDeleteClick,
}: AppointmentDetailsFooterProps) {
    const confirmAction = onStatusChange ? getConfirmAction(appointment) : null;
    const showStatusCancel = Boolean(onStatusChange && canChangeStatus(appointment));
    const showCustomerCancel = Boolean(onCancel && !onStatusChange && canChangeStatus(appointment));
    const showFooter = Boolean(onDelete || showStatusCancel || showCustomerCancel || confirmAction);

    const handleStatusCancel = () => {
        onStatusChange?.('CANCELLED');
    };

    const handleCustomerCancel = () => {
        onCancel?.();
    };

    const handleConfirm = () => {
        if (confirmAction) {
            onStatusChange?.(confirmAction.status);
        }
    };

    if (!showFooter) {
        return null;
    }

    return (
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
            <div className="flex items-center gap-2">
                {onDelete ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDeleteClick}
                        disabled={isActionPending}
                        className="text-error hover:bg-error-subtle"
                        data-testid="appointment-details-delete"
                    >
                        Excluir
                    </Button>
                ) : null}
                {showStatusCancel ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleStatusCancel}
                        disabled={isActionPending}
                        loading={isActionPending}
                        data-testid="appointment-details-cancel"
                    >
                        Cancelar
                    </Button>
                ) : null}
                {showCustomerCancel ? (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleCustomerCancel}
                        disabled={isActionPending}
                        loading={isActionPending}
                        data-testid="appointment-details-cancel"
                    >
                        Cancelar
                    </Button>
                ) : null}
            </div>
            {confirmAction ? (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConfirm}
                    disabled={isActionPending}
                    loading={isActionPending}
                    data-testid="appointment-details-confirm"
                >
                    {confirmAction.label}
                </Button>
            ) : null}
        </div>
    );
}

const AppointmentDetailsModal = ({
    open,
    appointment,
    onClose,
    loading = false,
    onDelete,
    onStatusChange,
    onCancel,
}: AppointmentDetailsModalProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isActionPending = loading || isDeleting;

    const handleDeleteConfirm = async () => {
        if (!onDelete) return;

        setIsDeleting(true);
        try {
            await onDelete();
            setIsDeleteDialogOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <BaseModal
                open={open && appointment !== null}
                onClose={onClose}
                size="sm"
                className="mt-24 overflow-hidden p-0 outline-none"
            >
                {appointment ? (
                    <div className="flex flex-col" data-testid="appointment-details-modal">
                        <AppointmentDetailsHeader onClose={onClose} isActionPending={isActionPending} />
                        <AppointmentDetailsBody appointment={appointment} />
                        <AppointmentDetailsFooter
                            appointment={appointment}
                            isActionPending={isActionPending}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
                            onCancel={onCancel}
                            onDeleteClick={() => setIsDeleteDialogOpen(true)}
                        />
                    </div>
                ) : null}
            </BaseModal>

            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Excluir agendamento de"
                itemName={appointment?.customer_name}
            />
        </>
    );
};

export default AppointmentDetailsModal;
