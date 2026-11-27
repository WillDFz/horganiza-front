'use client';

import { InstructionPanel } from '../../components/InstructionPanel';
import { SummaryPanel } from '../../components/SummaryPanel';
import { BOOKING_STEP_INSTRUCTIONS, getBookingWizardGridClass } from '../../utils/stepInstructions';
import { BookingWizardStepContent } from '../BookingWizardStepContent';

import type { CustomerBookingWizardState } from '@/hooks/useCustomerBookingWizard';

interface CustomerBookingWizardContentProps {
    wizard: CustomerBookingWizardState;
}

export function CustomerBookingWizardContent({ wizard }: Readonly<CustomerBookingWizardContentProps>) {
    const supportPhone = wizard.business?.phone?.trim() ?? '';
    const { Icon, title, body } = BOOKING_STEP_INSTRUCTIONS[wizard.step];

    return (
        <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <form
                onSubmit={wizard.step === 'customer' ? wizard.handleSubmit : (e) => e.preventDefault()}
                noValidate
            >
                <div className={getBookingWizardGridClass(wizard.step)}>
                    <InstructionPanel
                        accentColor={wizard.accentColor}
                        icon={<Icon sx={{ color: wizard.accentColor }} />}
                        title={title}
                        body={body}
                        supportPhone={supportPhone}
                    />

                    <div className="flex flex-col border-b border-gray-200 p-6 lg:min-h-[480px] lg:border-b-0 lg:border-r">
                        <BookingWizardStepContent wizard={wizard} />
                    </div>

                    {wizard.step !== 'service' ? (
                        <SummaryPanel
                            accentColor={wizard.accentColor}
                            primary={wizard.primary}
                            extras={wizard.extrasSelected}
                            lineItems={wizard.lineItems}
                            totalPrice={wizard.totalPrice}
                            bookingDate={wizard.bookingDate}
                            customerTime={wizard.customerTime}
                        />
                    ) : null}
                </div>
            </form>
        </div>
    );
}
