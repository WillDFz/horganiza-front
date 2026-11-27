'use client';

import type { InstructionPanelProps } from '@/types/booking';

export function InstructionPanel({
    accentColor,
    icon,
    title,
    body,
    supportPhone,
}: Readonly<InstructionPanelProps>) {
    const iconWrap =
        'flex h-12 w-12 shrink-0 items-center justify-center rounded-md';
    const titleCls =
        'mt-4 text-sm font-bold uppercase tracking-wide text-custom-black-200';
    const bodyCls = 'mt-2 text-sm leading-relaxed text-custom-black-600';

    return (
        <div className="flex flex-col border-b border-gray-200 p-6 lg:min-h-[480px] lg:border-b-0 lg:border-r">
            <div className={iconWrap} style={{ backgroundColor: `${accentColor}22` }}>
                {icon}
            </div>
            <h2 className={titleCls}>{title}</h2>
            <p className={bodyCls}>{body}</p>
            <div className="mt-auto pt-8 text-sm">
                <p className="font-bold text-custom-black-200">Dúvidas?</p>
                {supportPhone ? (
                    <p className="text-custom-black-600">Telefone {supportPhone}</p>
                ) : (
                    <p className="text-custom-black-600">Fale com o estabelecimento.</p>
                )}
            </div>
        </div>
    );
}
