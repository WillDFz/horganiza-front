'use client';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import {
    formatScheduleSlotLabel,
    getScheduleSlotStartTime,
} from '../../utils/bookingSchedule';

import type { AvailableScheduleSlot } from '@/types/api/staff.types';

export interface BookingScheduleSlotSelectProps {
    availableSlots: AvailableScheduleSlot[];
    selectedTime: string;
    onSelectTime: (time: string) => void;
}

export function BookingScheduleSlotSelect({
    availableSlots,
    selectedTime,
    onSelectTime,
}: Readonly<BookingScheduleSlotSelectProps>) {
    return (
        <FormControl fullWidth size="small" className="mt-3 max-w-xs">
            <InputLabel id="booking-slot-label">Horário</InputLabel>
            <Select
                labelId="booking-slot-label"
                label="Horário"
                value={selectedTime}
                onChange={(e) => onSelectTime(e.target.value)}
            >
                <MenuItem value="">
                    <em>Selecione um horário</em>
                </MenuItem>
                {availableSlots.map((slot) => {
                    const value = getScheduleSlotStartTime(slot);
                    return (
                        <MenuItem key={slot.init} value={value}>
                            {formatScheduleSlotLabel(slot)}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
