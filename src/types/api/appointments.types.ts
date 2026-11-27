export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
    id: string;
    business_id: string;
    staff_member_id?: string;
    customer_id: string;
    service_id: string;
    extra_service_ids?: string[];
    status: AppointmentStatus;
    schedule_time: Date | string;
    customer_name: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateAppointment extends Omit<Appointment, 'id' | 'created_at' | 'updated_at'> {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateAppointment extends Omit<Appointment, 'created_at' | 'updated_at'> {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateAppointmentStatus {
    status: AppointmentStatus;
}
