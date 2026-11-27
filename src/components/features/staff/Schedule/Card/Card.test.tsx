import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScheduleCard from './index';
import type { Weekday } from '@/types/api/staff.types';

jest.mock('@/components/ui/BaseModal', () => ({
  __esModule: true,
  default: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="modal">{children}</div> : null,
}));

jest.mock('@/components/features/staff/Schedule/Update', () => ({
  __esModule: true,
  default: () => <div>UpdateForm</div>,
}));

const weekday: Weekday = {
  id: '1',
  week_day: 'MONDAY',
  staff_id: 's1',
  start_time: '09:00',
  end_time: '18:00',
  is_active: true,
};

describe('ScheduleCard', () => {
  it('exibe dia e status ativo', () => {
    const onUpdate = jest.fn();
    render(<ScheduleCard weekday={weekday} onUpdate={onUpdate} />);

    expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('abre modal ao clicar em editar', () => {
    render(<ScheduleCard weekday={weekday} onUpdate={jest.fn()} />);

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
