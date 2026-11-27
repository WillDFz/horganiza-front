'use client';

import { formatNumberToBrMoneyInput } from '@/utils/formatters/money';

import type { Service } from '@/types/api/services.types';

import { serviceUnitPrice } from '@/utils/serviceUnitPrice';

export interface ServiceCardButtonProps {
    service: Service;
    accentColor: string;
    selected: boolean;
    onSelect: () => void;
}

export function ServiceCardButton({
    service,
    accentColor,
    selected,
    onSelect,
}: Readonly<ServiceCardButtonProps>) {
    const price = serviceUnitPrice(service);

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`
                flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors
                ${selected ? 'border-2 shadow-sm' : 'border-gray-200 hover:border-gray-300'}
            `}
            style={selected ? { borderColor: accentColor } : undefined}
        >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {service.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- URL externa de serviço
                    <img src={service.image} alt="" className="h-full w-full object-cover" />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-xs text-gray-400"
                        aria-hidden
                    >
                        —
                    </div>
                )}
            </div>
            <span className="flex-1 font-medium text-custom-black-200">{service.name}</span>
            <span className="shrink-0 text-sm font-semibold" style={{ color: accentColor }}>
                {formatNumberToBrMoneyInput(price)}
            </span>
        </button>
    );
}
