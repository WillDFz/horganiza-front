'use client';

import { Checkbox } from '@mui/material';

import { BOOKING_COLUMN_HEADING } from '../../constants';
import { formatNumberToBrMoneyInput } from '@/utils/formatters/money';

import { serviceUnitPrice } from '@/utils/serviceUnitPrice';

import type { ExtrasStepProps } from '@/types/booking';

export function ExtrasStep({
    accentColor,
    services,
    primaryServiceId,
    extraIds,
    onToggleExtra,
    onBack,
    onNext,
}: Readonly<ExtrasStepProps>) {
    const extraCandidates = services.filter((s) => s.id !== primaryServiceId);

    return (
        <>
            <h3 className={BOOKING_COLUMN_HEADING}>Serviços extras</h3>
            <ul className="mt-6 flex flex-col gap-2">
                {extraCandidates.map((svc) => {
                    const checked = extraIds.includes(svc.id);
                    const price = serviceUnitPrice(svc);
                    return (
                        <li
                            key={svc.id}
                            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
                        >
                            <label className="flex flex-1 cursor-pointer items-center gap-2">
                                <Checkbox
                                    checked={checked}
                                    onChange={() => onToggleExtra(svc.id)}
                                    size="small"
                                    sx={{ color: accentColor, '&.Mui-checked': { color: accentColor } }}
                                />
                                <span className="text-sm font-medium text-custom-black-200">{svc.name}</span>
                            </label>
                            <span
                                className="shrink-0 text-sm font-semibold"
                                style={{ color: accentColor }}
                            >
                                {formatNumberToBrMoneyInput(price)}
                            </span>
                        </li>
                    );
                })}
            </ul>
            <div className="mt-auto flex justify-between gap-4 pt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm font-medium text-custom-black-600 hover:text-custom-black-200"
                >
                    ← De volta
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="rounded px-5 py-2.5 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                >
                    Próximo →
                </button>
            </div>
        </>
    );
}
