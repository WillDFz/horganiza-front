import { AxiosError } from "axios";
import { BaseService } from "../base.service";
import {
    AvailableScheduleSlot,
    CreateStaffMember,
    GetAvailableAppointmentRangeParams,
    StaffMember,
    Weekday,
} from "@/types/api/staff.types";

export class StaffService extends BaseService {
    constructor() {
        super();
    }

    async createStaffMember(staffMember: CreateStaffMember): Promise<StaffMember> {
        try {
            const response = await this.api.post('/staff', staffMember);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to create staff member');
        }
    }

    async getStaffMembers(): Promise<StaffMember[]> {
        try {
            const response = await this.api.get(`staff/members`);
            return response.data.staffMembers;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to get staff members');
        }

    }

    async getStaffMemberById(id: string): Promise<StaffMember> {
        const response = await this.api.get(`/staff/${id}`);
        if (response.status !== 200) {
            throw new Error('Failed to get staff member');
        }
        return response.data.staffMember;
    }

    async updateStaffMember(staffMember: StaffMember): Promise<StaffMember> {
        const response = await this.api.put(`/staff/${staffMember.id}`, staffMember);
        if (response.status !== 200) {
            throw new Error('Failed to update staff member');
        }
        return response.data;
    }

    async deleteStaffMember(id: string): Promise<void> {
        try {
            const response = await this.api.delete(`/staff/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to delete staff member');
        }
    }

    // Schedule
    async getWeekdays(staff_id: string): Promise<Weekday[]> {
        try {
        const response = await this.api.get(`/staff/${staff_id}/schedule`);
            if (response.status !== 200) {
                throw new Error('Failed to get staff schedules');
            }
            return response.data.staffMemberWeekDaySchedule;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to get staff schedules');
        }
    }

    async updateWeekday(weekday: Weekday): Promise<Weekday> {
        const response = await this.api.put(`/staff/schedule`, weekday);
        if (response.status !== 200) {
            throw new Error('Failed to update staff schedule');
        }
        return response.data;
    }

    async getAvailableAppointmentRange(
        params: GetAvailableAppointmentRangeParams,
    ): Promise<AvailableScheduleSlot[]> {
        try {
            const { staff, date, duration } = params;
            const response = await this.api.get('appointment/staff/schedule', {
                params: { staff, date, duration },
            });
            if (response.status !== 200) {
                throw new Error('Failed to get available appointment range');
            }
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.message as string);
            }
            throw new Error('Failed to get available appointment range');
        }
    }
}