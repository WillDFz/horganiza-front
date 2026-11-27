
export interface StaffMember {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    business_id: string;
    created_at: string;
    updated_at: string;
    staffMemberWeekDaySchedule: Weekday[];
}

export interface CreateStaffMember {
    name: string;
    email?: string;
    phone: string;
    role: string;
    password: string;
    business_id: string;
}

export interface Weekday {
    id: string;
    week_day: string;
    staff_id: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
}

export interface CreateStaffSchedule {
    weekday: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    staff_id: string;
}

export interface AvailableScheduleSlot {
    init: string;
    end: string;
}

export interface GetAvailableAppointmentRangeParams {
    staff: string;
    date: string;
    duration: number;
}
