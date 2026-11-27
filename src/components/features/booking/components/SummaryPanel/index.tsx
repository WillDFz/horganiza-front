'use client';

import { formatNumberToBrMoneyInput } from '@/utils/formatters/money';

import type { SummaryPanelProps } from '@/types/booking';

export function SummaryPanel({
    accentColor,
    primary,
    extras,
    lineItems,
    totalPrice,
    bookingDate,
    customerTime,
}: Readonly<SummaryPanelProps>) {
    const dateTimeLabel =
        bookingDate !== null
            ? (() => {
                const base = bookingDate.toLocaleDateString('pt-BR', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                });
                return customerTime ? `${base}, ${customerTime}` : base;
            })()
            : null;

    return (
        <aside className="flex flex-col border-t border-gray-200 bg-white p-6 lg:min-h-[480px] lg:border-t-0 lg:border-l">
            <div
                className="mb-4 rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2"
                style={{
                    backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
                    backgroundSize: '6px 6px',
                }}
            >
                <h3 className="text-base font-bold text-custom-black-200">Resumo</h3>
            </div>
            <div className="flex flex-1 flex-col gap-2 text-sm text-custom-black-300">
                {primary ? (
                    <>
                        <p className="font-semibold text-custom-black-200">{primary.name}</p>
                        {dateTimeLabel ? (
                            <p className="text-custom-black-600">{dateTimeLabel}</p>
                        ) : null}
                        {extras.length > 0 ? (
                            <p className="text-custom-black-600">
                                Extras: {extras.map((s) => s.name).join(', ')}
                            </p>
                        ) : null}
                    </>
                ) : (
                    <p className="text-custom-black-600">Selecione um serviço para ver o resumo.</p>
                )}
            </div>
            <div className="mt-auto border-t border-custom-black-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-custom-black-600">
                    Valor do serviço
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                    {lineItems.map((row) => (
                        <li key={row.id} className="flex justify-between gap-2">
                            <span className="text-custom-black-300">{row.label}</span>
                            <span className="shrink-0 font-medium" style={{ color: accentColor }}>
                                {formatNumberToBrMoneyInput(row.price)}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-custom-black-100 pt-3 text-sm font-bold text-custom-black-200">
                    <span>Preço total</span>
                    <span>{formatNumberToBrMoneyInput(totalPrice)}</span>
                </div>
            </div>
        </aside>
    );
}
