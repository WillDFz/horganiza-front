import React, { useCallback, useEffect, useState } from 'react'
import { useStaff } from '@/hooks/useStaff';
import { Weekday } from '@/types/api/staff.types';
import ScheduleCard from './Card';
import { CircularProgress } from '@mui/material';

interface StaffScheduleProps {
    id: string;
}

const StaffSchedule: React.FC<StaffScheduleProps> = ({ id }) => {
    const { getWeekdays } = useStaff();
    const [weekdays, setWeekdays] = useState<Weekday[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleCheckSchedules = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getWeekdays(id);
            if (data) {
                setWeekdays(data);
            }
        } catch (error) {
            console.log('error', error);
        }
        finally {
            setLoading(false);
        }
    }, [id, getWeekdays]);


    useEffect(() => {
        if (id) {
            handleCheckSchedules();
        }
    }, [id, handleCheckSchedules]);

    return (
        <div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {weekdays.map((weekday) => (
                    <ScheduleCard key={weekday.id} weekday={weekday} onUpdate={handleCheckSchedules} />
                ))}
                {loading && <div className='flex justify-center items-center'>
                    <CircularProgress />
                </div>}
            </div>
        </div>
    )
}

export default StaffSchedule;
