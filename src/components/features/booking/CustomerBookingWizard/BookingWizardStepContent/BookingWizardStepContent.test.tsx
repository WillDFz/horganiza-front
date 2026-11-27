import { render, screen } from '@testing-library/react';

import { BookingWizardStepContent } from './index';

import type { CustomerBookingWizardState } from '@/hooks/useCustomerBookingWizard';

jest.mock('../../steps/ServiceStep', () => ({
    ServiceStep: () => <div>service-step</div>,
}));
jest.mock('../../steps/ExtrasStep', () => ({
    ExtrasStep: () => <div>extras-step</div>,
}));
jest.mock('../../steps/DateTimeStep', () => ({
    DateTimeStep: () => <div>datetime-step</div>,
}));
jest.mock('../../steps/CustomerStep', () => ({
    CustomerStep: () => <div>customer-step</div>,
}));

function createWizardState(
    overrides: Partial<CustomerBookingWizardState> = {},
): CustomerBookingWizardState {
    return {
        step: 'service',
        accentColor: '#000000',
        loading: false,
        submitting: false,
        services: [],
        primaryServiceId: null,
        extraIds: [],
        staffMembers: [],
        staffMemberId: '',
        calendarMonth: new Date(),
        bookingDate: null,
        customerTime: '',
        firstName: '',
        lastName: '',
        phoneDigits: '',
        daySlots: { isDayActive: true, availableSlots: [], displayRange: null, serviceExceedsWindow: false },
        todayStart: new Date(),
        selectPrimaryService: jest.fn(),
        toggleExtra: jest.fn(),
        goNextFromService: jest.fn(),
        goNextFromExtras: jest.fn(),
        goNextFromDatetime: jest.fn(),
        setStep: jest.fn(),
        setStaffMemberId: jest.fn(),
        setCalendarMonth: jest.fn(),
        selectBookingDate: jest.fn(),
        setCustomerTime: jest.fn(),
        setFirstName: jest.fn(),
        setLastName: jest.fn(),
        setPhoneDigits: jest.fn(),
        handleSubmit: jest.fn(),
        dayHasAvailability: jest.fn(),
        resetWizard: jest.fn(),
        ...overrides,
    } as CustomerBookingWizardState;
}

describe('BookingWizardStepContent', () => {
    it.each([
        ['service', 'service-step'],
        ['extras', 'extras-step'],
        ['datetime', 'datetime-step'],
        ['customer', 'customer-step'],
    ] as const)('renderiza step %s', (step, expectedText) => {
        render(<BookingWizardStepContent wizard={createWizardState({ step })} />);
        expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
});
