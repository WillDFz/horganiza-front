import { AppointmentsService } from "@/services/appointments/appointments.service";
import { Appointment, AppointmentStatus } from "@/types/api/appointments.types";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

type AppointmentDetailsAction = "status-change" | "delete" | "cancel";
type AppointmentDetailsMode = "staff" | "customer";

export const useAppointmentDetailsActions = ({
    appointment,
    mode,
    onRefresh,
    onSuccess,
}: {
    appointment: Appointment | null;
    mode: AppointmentDetailsMode;
    onRefresh?: () => void | Promise<void>;
    onSuccess?: (action: AppointmentDetailsAction, appointment: Appointment) => void;
}) => {
    const appointmentsService = useMemo(() => new AppointmentsService(), []);
    const [loading, setLoading] = useState<boolean>(false);

    const updateStatus = useCallback(
        async (status: AppointmentStatus) => {
            if (!appointment || mode !== "staff") return;

            setLoading(true);
            try {
                const data = await appointmentsService.updateAppointment(appointment.id, status);
                await onRefresh?.();
                onSuccess?.("status-change", data);
                toast.success("Agendamento atualizado com sucesso");
            } catch (error) {
                toast.error("Erro ao atualizar o agendamento");
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [appointment, mode, onRefresh, onSuccess, appointmentsService],
    );

    const deleteAppointment = useCallback(async () => {
        if (!appointment || mode !== "staff") return;

        setLoading(true);
        try {
            await appointmentsService.deleteAppointment(appointment.id);
            await onRefresh?.();
            onSuccess?.("delete", appointment);
            toast.success("Agendamento deletado com sucesso");
        } catch (error) {
            toast.error("Erro ao deletar o agendamento");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointment, mode, onRefresh, onSuccess, appointmentsService]);

    const cancelAppointment = useCallback(async () => {
        if (!appointment || mode !== "customer") return;

        setLoading(true);
        try {
            const data = await appointmentsService.cancelAppointment(appointment.id);
            await onRefresh?.();
            onSuccess?.("cancel", data);
            toast.success("Agendamento cancelado com sucesso");
        } catch (error) {
            toast.error("Erro ao cancelar o agendamento");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointment, mode, onRefresh, onSuccess, appointmentsService]);

    return {
        loading,
        updateStatus: mode === "staff" ? updateStatus : undefined,
        deleteAppointment: mode === "staff" ? deleteAppointment : undefined,
        cancelAppointment: mode === "customer" ? cancelAppointment : undefined,
    };
};
