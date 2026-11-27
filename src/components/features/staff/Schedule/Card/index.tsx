import React, { useState } from 'react'
import { Weekday } from '@/types/api/staff.types';
import { Edit } from '@mui/icons-material';
import BaseModal from '@/components/ui/BaseModal';
import ScheduleUpdate from '@/components/features/staff/Schedule/Update'
import { scheduleTimeToInput } from '@/utils/formatters/scheduleTime';

interface ScheduleCardProps {
    weekday: Weekday;
    onUpdate: () => void;
}

const getWeekday = (weekday: string) => {
    switch (weekday) {
        case 'MONDAY':
            return 'Segunda-feira';
        case 'TUESDAY':
            return 'Terça-feira';
        case 'WEDNESDAY':
            return 'Quarta-feira';
        case 'THURSDAY':
            return 'Quinta-feira';
        case 'FRIDAY':
            return 'Sexta-feira';
        case 'SATURDAY':
            return 'Sábado';
        case 'SUNDAY':
            return 'Domingo';
        default:
            return 'Dia da semana';
    }
}



const ScheduleCard: React.FC<ScheduleCardProps> = ({ weekday, onUpdate }) => {

    const [open, setOpen] = useState<boolean>(false);

    const handleUpdate = () => {
        onUpdate();
        setOpen(false);
    };

    return (
        <div>
            <div className='bg-white rounded-lg p-4 shadow-md '>
                <div className='flex justify-between '>
                    <div className='flex flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <p className='text-lg font-bold'>{getWeekday(weekday.week_day)}</p>
                            <div className={`w-fit text-xs rounded-full px-2 py-1 ${weekday.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{weekday.is_active ? 'Ativo' : 'Inativo'}</div>
                        </div>
                        <p className='text-sm text-gray-500'>{scheduleTimeToInput(weekday.start_time)} – {scheduleTimeToInput(weekday.end_time)}</p>
                    </div>
                    <div>
                        <button className='' onClick={() => setOpen(true)}>
                            <Edit className='text-primary-dark' />
                        </button>
                    </div>
                </div>
            </div>
            <BaseModal open={open} onClose={() => setOpen(false)} size='sm'>
                <ScheduleUpdate weekday={weekday} onUpdate={handleUpdate} />
            </BaseModal>
        </div>
    )
}

export default ScheduleCard