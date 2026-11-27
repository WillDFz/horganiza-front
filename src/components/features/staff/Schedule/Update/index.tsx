import { Weekday } from '@/types/api/staff.types';
import React, { useState } from 'react'
import { useStaff } from '@/hooks/useStaff';
import { FormControl, FormControlLabel, Switch, TextField } from '@mui/material';
import { scheduleTimeToInput } from '@/utils/formatters/scheduleTime';

interface ScheduleUpdateProps {
    weekday: Weekday;
    onUpdate: () => void;
}

const getWeekdayLabel = (weekDay: string): string => {
    switch (weekDay) {
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
};

const ScheduleUpdate: React.FC<ScheduleUpdateProps> = ({ weekday, onUpdate }) => {
    const { updateWeekday } = useStaff();
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<Weekday>({
        id: weekday.id,
        staff_id: weekday.staff_id,
        week_day: weekday.week_day,
        start_time: scheduleTimeToInput(weekday.start_time),
        end_time: scheduleTimeToInput(weekday.end_time),
        is_active: weekday.is_active,
    });


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await updateWeekday(formData);
            if (data) {
                onUpdate();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <p className='text-lg font-bold text-center mb-4'>Atualizar horário de {getWeekdayLabel(weekday.week_day)}</p>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-2 gap-4'>
                    <TextField
                        label="Início"
                        name="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                        label="Fim"
                        name="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        required
                        fullWidth
                        variant="outlined"
                        size="small"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <FormControl className='w-fit'>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    name="is_active"
                                />
                            }
                            label="Ativo"
                            labelPlacement="top"
                        />
                    </FormControl>
                </div>

                <div>
                    <button type="submit" className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors' disabled={loading}>
                        {loading ? 'Carregando...' : 'Atualizar'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ScheduleUpdate;