import { render, screen, waitFor } from '@testing-library/react';
import StaffSchedule from './index';
import { useStaff } from '@/hooks/useStaff';

jest.mock('@/hooks/useStaff', () => ({
  useStaff: jest.fn(),
}));

jest.mock('./Card', () => ({
  __esModule: true,
  default: ({ weekday }: { weekday: { id: string; week_day: string } }) => (
    <div data-testid={`card-${weekday.id}`}>{weekday.week_day}</div>
  ),
}));

describe('StaffSchedule', () => {
  const getWeekdays = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStaff as jest.Mock).mockReturnValue({ getWeekdays });
  });

  it('loads weekdays and renders cards', async () => {
    getWeekdays.mockResolvedValue([
      {
        id: 'w1',
        week_day: 'MONDAY',
        staff_id: 's1',
        start_time: '09:00',
        end_time: '18:00',
        is_active: true,
      },
    ]);

    render(<StaffSchedule id="s1" />);

    await waitFor(() => {
      expect(getWeekdays).toHaveBeenCalledWith('s1');
    });
    expect(screen.getByTestId('card-w1')).toBeInTheDocument();
  });
});
