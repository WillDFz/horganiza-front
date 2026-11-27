import { renderHook, act } from "@testing-library/react";
import { useAppointmentDetailsActions } from "./index";
import { AppointmentsService } from "@/services/appointments/appointments.service";
import { toast } from "react-toastify";
import type { Appointment } from "@/types/api/appointments.types";

jest.mock("@/services/appointments/appointments.service");
jest.mock("react-toastify", () => ({
    toast: { error: jest.fn(), success: jest.fn() },
}));

const appointment: Appointment = {
    id: "apt-1",
    business_id: "b1",
    staff_member_id: "st1",
    customer_id: "c1",
    service_id: "s1",
    status: "SCHEDULED",
    schedule_time: "2026-06-19T07:30:00.000Z",
    customer_name: "Teste Testar",
    created_at: "",
    updated_at: "",
};

describe("useAppointmentDetailsActions", () => {
    let mock: {
        updateAppointment: jest.Mock;
        deleteAppointment: jest.Mock;
        cancelAppointment: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mock = {
            updateAppointment: jest.fn(),
            deleteAppointment: jest.fn(),
            cancelAppointment: jest.fn(),
        };
        (AppointmentsService as jest.Mock).mockImplementation(() => mock);
    });

    it("atualiza status no modo staff", async () => {
        const onRefresh = jest.fn().mockResolvedValue(undefined);
        const onSuccess = jest.fn();
        const updated = { ...appointment, status: "CONFIRMED" as const };
        mock.updateAppointment.mockResolvedValue(updated);

        const { result } = renderHook(() =>
            useAppointmentDetailsActions({
                appointment,
                mode: "staff",
                onRefresh,
                onSuccess,
            }),
        );

        await act(async () => {
            await result.current.updateStatus?.("CONFIRMED");
        });

        expect(mock.updateAppointment).toHaveBeenCalledWith("apt-1", "CONFIRMED");
        expect(onRefresh).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith("status-change", updated);
        expect(toast.success).toHaveBeenCalledWith("Agendamento atualizado com sucesso");
    });

    it("exclui agendamento no modo staff", async () => {
        const onRefresh = jest.fn().mockResolvedValue(undefined);
        const onSuccess = jest.fn();
        mock.deleteAppointment.mockResolvedValue(undefined);

        const { result } = renderHook(() =>
            useAppointmentDetailsActions({
                appointment,
                mode: "staff",
                onRefresh,
                onSuccess,
            }),
        );

        await act(async () => {
            await result.current.deleteAppointment?.();
        });

        expect(mock.deleteAppointment).toHaveBeenCalledWith("apt-1");
        expect(onRefresh).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith("delete", appointment);
        expect(toast.success).toHaveBeenCalledWith("Agendamento deletado com sucesso");
    });

    it("cancela agendamento no modo customer", async () => {
        const onRefresh = jest.fn().mockResolvedValue(undefined);
        const onSuccess = jest.fn();
        const cancelled = { ...appointment, status: "CANCELLED" as const };
        mock.cancelAppointment.mockResolvedValue(cancelled);

        const { result } = renderHook(() =>
            useAppointmentDetailsActions({
                appointment,
                mode: "customer",
                onRefresh,
                onSuccess,
            }),
        );

        await act(async () => {
            await result.current.cancelAppointment?.();
        });

        expect(mock.cancelAppointment).toHaveBeenCalledWith("apt-1");
        expect(onRefresh).toHaveBeenCalledTimes(1);
        expect(onSuccess).toHaveBeenCalledWith("cancel", cancelled);
        expect(toast.success).toHaveBeenCalledWith("Agendamento cancelado com sucesso");
    });
});
