'use client';

import { BOOKING_COLUMN_HEADING } from '../../constants';

import { ServiceCardButton } from '../../components/ServiceCardButton';

import type { ServiceStepProps } from '@/types/booking';

export function ServiceStep({
    accentColor,
    services,
    primaryServiceId,
    onSelectService,
    onNext,
}: Readonly<ServiceStepProps>) {
    return (
        <>
            <h3 className={BOOKING_COLUMN_HEADING}>Selecione seu serviço</h3>
            <ul className="mt-6 flex flex-col gap-3">
                {services.map((service) => (
                    <li key={service.id}>
                        <ServiceCardButton
                            service={service}
                            accentColor={accentColor}
                            selected={primaryServiceId === service.id}
                            onSelect={() => onSelectService(service.id)}
                        />
                    </li>
                ))}
            </ul>
            <div className="mt-auto flex justify-end pt-8">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!primaryServiceId}
                    className="rounded px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                >
                    Próximo →
                </button>
            </div>
        </>
    );
}
