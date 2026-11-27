import { AppointmentsService } from "@/services/appointments/appointments.service";
import { Appointment, AppointmentStatus } from "@/types/api/appointments.types";
import { isUnauthorizedError } from "@/utils/api/isUnauthorizedError";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const useAppointments = () => {
    const appointmentsService = useMemo(() => new AppointmentsService(), []);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const getMyAppointments = useCallback(async (business_id: string) => {
        setLoading(true);
        try {
            const data = await appointmentsService.getMyAppointments(business_id);
            setAppointments(data);
            return data;
        } catch (error) {
            if (!isUnauthorizedError(error)) {
                toast.error('Erro ao carregar os agendamentos');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointmentsService]);


    const getAppointmentsByStaff = useCallback(async (staff_id: string, business_id: string) => {
        setLoading(true);
        try {
            const data = await appointmentsService.getAppointmentsByStaff(staff_id, business_id);
            setAppointments(data);
            return data;
        } catch (error) {
            if (!isUnauthorizedError(error)) {
                toast.error('Erro ao carregar os agendamentos');
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointmentsService]);


    const createAppointment = useCallback(async (appointment: Appointment) => {
        setLoading(true);
        try {
            const data = await appointmentsService.createAppointment(appointment);
            setAppointments((prevAppointments) => [...prevAppointments, data]);
            return data;
        } catch (error) {
            toast.error('Erro ao criar o agendamento');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointmentsService]);

    const updateAppointment = useCallback(async (id: string, status: AppointmentStatus) => {
        setLoading(true);
        try {
            const data = await appointmentsService.updateAppointment(id, status);
            setAppointments((prevAppointments) => prevAppointments.map((p) => p.id === id ? data : p));
            toast.success('Agendamento atualizado com sucesso');
            return data;
        } catch (error) {
            toast.error('Erro ao atualizar o agendamento');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointmentsService]);

    const cancelAppointment = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await appointmentsService.cancelAppointment(id);
            setAppointments((prevAppointments) => prevAppointments.map((p) => p.id === id ? data : p));
            toast.success('Agendamento cancelado com sucesso');
            return data;
        } catch (error) {
            toast.error('Erro ao cancelar o agendamento');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointmentsService]);

    const deleteAppointment = useCallback(async (id: string) => {
        setLoading(true);
        try {
            await appointmentsService.deleteAppointment(id);
            setAppointments((prevAppointments) => prevAppointments.filter((p) => p.id !== id));
            toast.success('Agendamento deletado com sucesso');
        } catch (error) {
            toast.error('Erro ao deletar o agendamento');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [appointmentsService]);

    return {
        getMyAppointments,
        getAppointmentsByStaff,
        createAppointment,
        updateAppointment,
        cancelAppointment,
        deleteAppointment,
        appointments,
        loading,
    };
};

