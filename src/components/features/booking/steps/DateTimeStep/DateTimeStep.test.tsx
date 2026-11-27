import { render, screen } from '@testing-library/react';

import { DateTimeStep } from './index';

describe('DateTimeStep', () => {
    it('renderiza heading da etapa', () => {
        render(
            <DateTimeStep
                accentColor="#666666"
                staffMembers={[
                    {
                        id: 'stf-1',
                        name: 'Profissional',
                        role: 'STAFF',
                        business_id: 'biz-1',
                        created_at: '',
                        updated_at: '',
                        staffMemberWeekDaySchedule: [],
                    },
                ]}
                staffMemberId="stf-1"
                onStaffChange={jest.fn()}
                calendarMonth={new Date(2026, 4, 1)}
                onCalendarMonthChange={jest.fn()}
                bookingDate={null}
                onSelectDate={jest.fn()}
                customerTime=""
                onSelectTime={jest.fn()}
                daySlots={{
                    isDayActive: true,
                    availableSlots: [],
                    displayRange: null,
                    serviceExceedsWindow: false,
                }}
                todayStart={new Date(2026, 4, 1)}
                dayHasAvailability={() => true}
                onBack={jest.fn()}
                onNext={jest.fn()}
            />,
        );

        expect(screen.getByText('Selecione data e horário')).toBeInTheDocument();
    });
});
