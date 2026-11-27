import { BaseService } from "../base.service";
import { Appointment, AppointmentStatus, UpdateAppointmentStatus } from "@/types/api/appointments.types";

export class AppointmentsService extends BaseService {
    constructor() {
        super();
    }

    async getMyAppointments(business_id: string): Promise<Appointment[]> {
        const response = await this.api.get(`/appointment?business_id=${business_id}`);
        if (response.status !== 200) {
            throw new Error('Failed to get appointments');
        }
        return response.data;
    }

    async getAppointmentById(id: string): Promise<Appointment> {
        const response = await this.api.get(`/appointments/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to get appointment');
        }
        return response.data;
    }

    async getAppointmentsByStaff(staff_id: string, business_id: string): Promise<Appointment[]> {
        const response = await this.api.get(`/appointment/staff?staff=${staff_id}&business_id=${business_id}`);
        if (response.status !== 200) {
            throw new Error('Failed to get appointments');
        }
        return response.data;
    }

    async createAppointment(appointment: Appointment): Promise<Appointment> {
        const response = await this.api.post('/appointment', appointment);
        if (response.status !== 201) {
            throw new Error('Failed to create appointment');
        }
        return response.data;
    }

    async updateAppointment(id: string, status: AppointmentStatus): Promise<Appointment> {
        const payload: UpdateAppointmentStatus = { status };
        const response = await this.api.patch(`/appointment/${id}`, payload);
        if (response.status !== 200) {
            throw new Error('Failed to update appointment');
        }
        return response.data;
    }

    async cancelAppointment(id: string): Promise<Appointment> {
        return this.updateAppointment(id, 'CANCELLED');
    }

    async deleteAppointment(id: string): Promise<void> {
        const response = await this.api.delete(`/appointment/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to delete appointment');
        }
        return response.data;
    }
}

