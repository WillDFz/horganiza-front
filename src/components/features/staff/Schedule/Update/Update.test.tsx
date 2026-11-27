import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScheduleUpdate from './index';
import { useStaff } from '@/hooks/useStaff';

jest.mock('@/hooks/useStaff', () => ({
  useStaff: jest.fn(),
}));

const weekday = {
  id: 'w1',
  week_day: 'MONDAY' as const,
  staff_id: 's1',
  start_time: '09:00:00',
  end_time: '18:00:00',
  is_active: true,
};

describe('ScheduleUpdate', () => {
  const updateWeekday = jest.fn();
  const onUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStaff as jest.Mock).mockReturnValue({ updateWeekday });
  });

  it('submits and calls onUpdate on success', async () => {
    updateWeekday.mockResolvedValue(weekday);

    render(<ScheduleUpdate weekday={weekday} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByRole('button', { name: /atualizar/i }));

    await waitFor(() => {
      expect(updateWeekday).toHaveBeenCalled();
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});
