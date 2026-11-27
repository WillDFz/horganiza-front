'use client';

import { CustomerStep } from '../../steps/CustomerStep';
import { DateTimeStep } from '../../steps/DateTimeStep';
import { ExtrasStep } from '../../steps/ExtrasStep';
import { ServiceStep } from '../../steps/ServiceStep';

import type { CustomerBookingWizardState } from '@/hooks/useCustomerBookingWizard';

interface BookingWizardStepContentProps {
    wizard: CustomerBookingWizardState;
}

export function BookingWizardStepContent({ wizard }: Readonly<BookingWizardStepContentProps>) {
    switch (wizard.step) {
        case 'service':
            return (
                <ServiceStep
                    accentColor={wizard.accentColor}
                    services={wizard.services}
                    primaryServiceId={wizard.primaryServiceId}
                    onSelectService={wizard.selectPrimaryService}
                    onNext={wizard.goNextFromService}
                />
            );
        case 'extras':
            return (
                <ExtrasStep
                    accentColor={wizard.accentColor}
                    services={wizard.services}
                    primaryServiceId={wizard.primaryServiceId}
                    extraIds={wizard.extraIds}
                    onToggleExtra={wizard.toggleExtra}
                    onBack={() => wizard.setStep('service')}
                    onNext={wizard.goNextFromExtras}
                />
            );
        case 'datetime':
            return (
                <DateTimeStep
                    accentColor={wizard.accentColor}
                    staffMembers={wizard.staffMembers}
                    staffMemberId={wizard.staffMemberId}
                    onStaffChange={wizard.setStaffMemberId}
                    calendarMonth={wizard.calendarMonth}
                    onCalendarMonthChange={wizard.setCalendarMonth}
                    bookingDate={wizard.bookingDate}
                    onSelectDate={wizard.selectBookingDate}
                    customerTime={wizard.customerTime}
                    onSelectTime={wizard.setCustomerTime}
                    daySlots={wizard.daySlots}
                    todayStart={wizard.todayStart}
                    dayHasAvailability={wizard.dayHasAvailability}
                    onBack={() => wizard.setStep('extras')}
                    onNext={wizard.goNextFromDatetime}
                />
            );
        case 'customer':
            return (
                <CustomerStep
                    accentColor={wizard.accentColor}
                    firstName={wizard.firstName}
                    lastName={wizard.lastName}
                    phoneDigits={wizard.phoneDigits}
                    onFirstNameChange={wizard.setFirstName}
                    onLastNameChange={wizard.setLastName}
                    onPhoneDigitsChange={wizard.setPhoneDigits}
                    submitting={wizard.submitting}
                    onBack={() => wizard.setStep('datetime')}
                />
            );
    }
}
