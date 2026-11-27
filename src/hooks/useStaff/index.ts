import { StaffService } from "@/services/staff/staff.service";
import { CreateStaffMember, GetAvailableAppointmentRangeParams, StaffMember, Weekday } from "@/types/api/staff.types";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const useStaff = () => {
    const staffService = useMemo(() => new StaffService(), []);
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const getStaffMembers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await staffService.getStaffMembers();
            setStaffMembers(data);
            return data;
        } catch (error) {
            toast.error('Erro ao carregar os funcionários');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [staffService]);

    const getStaffMemberById = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await staffService.getStaffMemberById(id);
            setStaffMember(data);
            return data;
        } catch (error) {
            toast.error('Erro ao carregar o funcionário');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [staffService]);

    const createStaffMember = useCallback(async (staffMember: CreateStaffMember) => {
        setLoading(true);
        try {
            const data = await staffService.createStaffMember(staffMember);
            toast.success('Atendente adicionado com sucesso');
            return data;
        } catch (error) {
            toast.error('Erro ao adicionar o atendente');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [staffService]);

    const updateStaffMember = useCallback(async (staffMember: StaffMember) => {
        setLoading(true);
        try {
            const data = await staffService.updateStaffMember(staffMember);
            toast.success('Atendente atualizado com sucesso');
            return data;
        } catch (error) {
            toast.error('Erro ao atualizar o atendente');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [staffService]);

    const deleteStaffMember = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await staffService.deleteStaffMember(id);
            toast.success('Atendente deletado com sucesso');
            return data;
        } catch (error) {
            toast.error('Erro ao deletar o atendente');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [staffService]);

    const getWeekdays = useCallback(async (staff_schedule_id: string) => {
        setLoading(true);
        try {
            const data = await staffService.getWeekdays(staff_schedule_id);
            return data;
        } catch (error) {
            toast.error('Erro ao carregar os horários do atendente');
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, [staffService]);

    const updateWeekday = useCallback(async (week_day: Weekday) => {
        setLoading(true);
        try {
            const data = await staffService.updateWeekday(week_day);
            toast.success('Horário atualizado com sucesso');
            return data;
        } catch (error) {
            toast.error('Erro ao atualizar o horário');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [staffService]);

    const getAvailableAppointmentRange = useCallback(
        async (params: GetAvailableAppointmentRangeParams) => {
            try {
                return await staffService.getAvailableAppointmentRange(params);
            } catch (error) {
                toast.error('Erro ao carregar horários disponíveis');
                throw error;
            }
        },
        [staffService],
    );

    return {
        getStaffMembers,
        createStaffMember,
        updateStaffMember,
        deleteStaffMember,
        getWeekdays,
        updateWeekday,
        getAvailableAppointmentRange,
        staffMembers,
        loading,
        getStaffMemberById,
        staffMember
    };
}