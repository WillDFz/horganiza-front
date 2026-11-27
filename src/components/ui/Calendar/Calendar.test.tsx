import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CalendarComponent from './index';
import type { Appointment } from '@/types/api/appointments.types';

jest.mock('@/hooks/useAppointmentDetailsActions', () => ({
  useAppointmentDetailsActions: jest.fn(
    (options: {
      onRefresh?: () => void | Promise<void>;
      onSuccess?: (action: 'delete', appointment: { id: string }) => void;
    }) => ({
      loading: false,
      updateStatus: options.onRefresh ? jest.fn() : undefined,
      deleteAppointment: options.onRefresh
        ? jest.fn(async () => {
            options.onSuccess?.('delete', { id: 'apt-delete' });
          })
        : undefined,
      cancelAppointment: undefined,
    }),
  ),
}));

jest.mock('@/components/ui/BaseModal', () => ({
  __esModule: true,
  default: ({
    open,
    children,
    onClose,
  }: {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="calendar-modal">
        {children}
        <button type="button" onClick={onClose}>
          Fechar modal
        </button>
      </div>
    ) : null,
}));

jest.mock('@/components/ui/DeleteConfirmationDialog', () => ({
  __esModule: true,
  default: ({
    open,
    onClose,
    onConfirm,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) =>
    open ? (
      <div data-testid="delete-dialog">
        <button type="button" onClick={onClose} data-testid="cancel-remove">
          Cancelar
        </button>
        <button type="button" onClick={onConfirm} data-testid="confirm-remove">
          Excluir
        </button>
      </div>
    ) : null,
}));

function appointmentOnDate(day: Date, overrides?: Partial<Appointment>): Appointment {
  const y = day.getFullYear();
  const m = String(day.getMonth() + 1).padStart(2, '0');
  const d = String(day.getDate()).padStart(2, '0');
  return {
    id: 'apt-1',
    business_id: 'b1',
    customer_id: 'c1',
    service_id: 's1',
    staff_member_id: 'st1',
    status: 'CONFIRMED',
    schedule_time: `${y}-${m}-${d}T14:00:00.000Z`,
    customer_name: 'Maria Silva',
    created_at: '',
    updated_at: '',
    ...overrides,
  };
}

const monthNamesPt = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function dayListButton(day: Date) {
  const month = monthNamesPt[day.getMonth()];
  return screen.getByRole('button', {
    name: new RegExp(`ver agendamentos em ${day.getDate()} de ${month}`, 'i'),
  });
}

describe('CalendarComponent', () => {
  const mockOnDateChange = jest.fn();
  const mockOnEventClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza navegação e grade', () => {
    render(
      <CalendarComponent appointments={[]} onDateChange={mockOnDateChange} />,
    );

    expect(screen.getByTestId('calendar-today')).toBeInTheDocument();
    expect(screen.getByLabelText(/ir para hoje/i)).toBeInTheDocument();
    expect(mockOnDateChange).toHaveBeenCalled();
  });

  it('navega entre meses e anos', () => {
    render(<CalendarComponent appointments={[]} />);

    const heading = screen.getByRole('heading', { level: 2 });
    const initialLabel = heading.textContent;

    fireEvent.click(screen.getByTestId('calendar-next-month'));
    expect(heading.textContent).not.toBe(initialLabel);

    fireEvent.click(screen.getByTestId('calendar-prev-month'));
    expect(heading.textContent).toBe(initialLabel);

    fireEvent.click(screen.getByTestId('calendar-next-year'));
    expect(heading.textContent).not.toBe(initialLabel);

    fireEvent.click(screen.getByTestId('calendar-today'));
    expect(heading.textContent).toMatch(new RegExp(String(new Date().getFullYear())));
  });

  it('exibe agendamentos e abre lista do dia ao clicar no dia', () => {
    const day = new Date();
    const apt = appointmentOnDate(day);

    render(
      <CalendarComponent
        appointments={[apt]}
      />,
    );

    expect(screen.getByText('Maria Silva')).toBeInTheDocument();

    fireEvent.click(dayListButton(day));

    expect(screen.getByTestId('calendar-modal')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-day-list-modal')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-day-appointment-apt-1')).toBeInTheDocument();
  });

  it('lista todos os agendamentos do dia quando há mais de três', () => {
    const day = new Date();
    const appointments = [1, 2, 3, 4].map((n) =>
      appointmentOnDate(day, { id: `apt-${n}`, customer_name: `Cliente ${n}` }),
    );

    render(<CalendarComponent appointments={appointments} />);

    expect(screen.getByText('+1 mais')).toBeInTheDocument();
    expect(screen.queryByText('Cliente 4')).not.toBeInTheDocument();

    fireEvent.click(dayListButton(day));

    expect(screen.getByText('Cliente 4')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-day-appointment-apt-1')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-day-appointment-apt-4')).toBeInTheDocument();
  });

  it('abre detalhes ao clicar no agendamento na grade', () => {
    const day = new Date();
    const apt = appointmentOnDate(day, { id: 'apt-edit', status: 'SCHEDULED', notes: 'Obs teste' });

    render(<CalendarComponent appointments={[apt]} />);

    fireEvent.click(screen.getByText('Maria Silva'));

    expect(screen.getByTestId('appointment-details-modal')).toBeInTheDocument();
    expect(screen.getByText('Detalhes do agendamento')).toBeInTheDocument();
    expect(screen.getByText('Obs teste')).toBeInTheDocument();
    expect(screen.getByText('Agendado')).toBeInTheDocument();
  });

  it('abre detalhes a partir da lista do dia e permite voltar', () => {
    const day = new Date();
    const apt = appointmentOnDate(day, { id: 'apt-from-list' });

    render(<CalendarComponent appointments={[apt]} />);

    fireEvent.click(dayListButton(day));

    fireEvent.click(screen.getByTestId('calendar-day-appointment-apt-from-list'));

    expect(screen.getByTestId('appointment-details-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Fechar'));
    expect(screen.getByTestId('calendar-day-list-modal')).toBeInTheDocument();
  });

  it('delega clique no agendamento para onEventClick quando informado', () => {
    const day = new Date();
    const apt = appointmentOnDate(day);

    render(
      <CalendarComponent
        appointments={[apt]}
        onEventClick={mockOnEventClick}
      />,
    );

    fireEvent.click(screen.getByText('Maria Silva'));

    expect(mockOnEventClick).toHaveBeenCalledWith(apt);
    expect(screen.queryByTestId('calendar-modal')).not.toBeInTheDocument();
  });

  it('fecha modal pelo botão fechar', () => {
    const day = new Date();

    render(<CalendarComponent appointments={[]} />);

    fireEvent.click(dayListButton(day));

    expect(screen.getByTestId('calendar-day-list-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^fechar$/i }));
    expect(screen.queryByTestId('calendar-modal')).not.toBeInTheDocument();
  });

  it('ignora agendamentos com data inválida', () => {
    render(
      <CalendarComponent
        appointments={[
          {
            ...appointmentOnDate(new Date()),
            schedule_time: 'invalid-date',
          },
        ]}
      />,
    );

    expect(screen.queryByText('Maria Silva')).not.toBeInTheDocument();
  });

  it('exclui agendamento quando onRefresh é informado', async () => {
    const day = new Date();
    const apt = appointmentOnDate(day, { id: 'apt-delete', status: 'SCHEDULED' });
    const mockOnRefresh = jest.fn().mockResolvedValue(undefined);

    render(
      <CalendarComponent
        appointments={[apt]}
        onRefresh={mockOnRefresh}
      />,
    );

    fireEvent.click(screen.getByText('Maria Silva'));
    fireEvent.click(screen.getByTestId('appointment-details-delete'));
    fireEvent.click(screen.getByTestId('confirm-remove'));

    await waitFor(() => {
      expect(screen.queryByTestId('appointment-details-modal')).not.toBeInTheDocument();
    });
  });
});
