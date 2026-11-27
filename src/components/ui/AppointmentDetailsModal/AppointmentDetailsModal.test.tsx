import { fireEvent, render, screen } from '@testing-library/react';
import AppointmentDetailsModal from './index';
import { Appointment } from '@/types/api/appointments.types';

const appointment: Appointment = {
    id: 'apt-1',
    business_id: 'b1',
    service_id: 's1',
    staff_member_id: 'st1',
    customer_id: 'c1',
    customer_name: 'Teste Testar',
    schedule_time: '2026-06-19T07:30:00.000Z',
    status: 'SCHEDULED',
    notes: 'Telefone: +55 (11) 11111-1111',
    created_at: '',
    updated_at: '',
};

describe('AppointmentDetailsModal', () => {
    it('renderiza detalhes do agendamento', () => {
        render(
            <AppointmentDetailsModal
                open
                appointment={appointment}
                onClose={jest.fn()}
            />,
        );

        expect(screen.getByText('Detalhes do agendamento')).toBeInTheDocument();
        expect(screen.getByText('Teste Testar')).toBeInTheDocument();
        expect(screen.getByText('Agendado')).toBeInTheDocument();
        expect(screen.getByText('Telefone: +55 (11) 11111-1111')).toBeInTheDocument();
    });

    it('chama onStatusChange ao cancelar e confirmar', () => {
        const onStatusChange = jest.fn();

        render(
            <AppointmentDetailsModal
                open
                appointment={appointment}
                onClose={jest.fn()}
                onStatusChange={onStatusChange}
            />,
        );

        fireEvent.click(screen.getByTestId('appointment-details-cancel'));
        fireEvent.click(screen.getByTestId('appointment-details-confirm'));

        expect(onStatusChange).toHaveBeenCalledWith('CANCELLED');
        expect(onStatusChange).toHaveBeenCalledWith('CONFIRMED');
    });

    it('abre confirmação antes de excluir', () => {
        const onDelete = jest.fn();

        render(
            <AppointmentDetailsModal
                open
                appointment={appointment}
                onClose={jest.fn()}
                onDelete={onDelete}
            />,
        );

        fireEvent.click(screen.getByTestId('appointment-details-delete'));
        fireEvent.click(screen.getByTestId('confirm-remove'));

        expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
