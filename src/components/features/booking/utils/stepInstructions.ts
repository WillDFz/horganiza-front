import type { ElementType } from 'react';
import {
    CalendarMonthOutlined,
    CheckBoxOutlined,
    FormatListBulleted,
    PersonOutline,
} from '@mui/icons-material';

import type { BookingWizardStep } from '@/types/booking';

export interface StepInstruction {
    Icon: ElementType<{ sx?: object }>;
    title: string;
    body: string;
}

export const BOOKING_STEP_INSTRUCTIONS: Record<BookingWizardStep, StepInstruction> = {
    service: {
        Icon: FormatListBulleted,
        title: 'Selecione o serviço',
        body: 'Por favor, selecione um serviço para o qual você deseja agendar um atendimento!',
    },
    extras: {
        Icon: CheckBoxOutlined,
        title: 'Selecione o serviço extra',
        body: 'Por favor, selecione os serviços extras para sua consulta.',
    },
    datetime: {
        Icon: CalendarMonthOutlined,
        title: 'Selecione data e horário',
        body: 'Por favor, selecione a data e a hora para sua consulta.',
    },
    customer: {
        Icon: PersonOutline,
        title: 'Insira suas informações',
        body: 'Por favor, insira suas informações de contato.',
    },
};

export function getBookingWizardGridClass(step: BookingWizardStep): string {
    return step === 'service'
        ? 'grid grid-cols-1 lg:grid-cols-[minmax(240px,28%)_1fr]'
        : 'grid grid-cols-1 lg:grid-cols-[minmax(220px,24%)_minmax(0,1fr)_minmax(260px,30%)]';
}
