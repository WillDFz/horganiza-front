'use client';

export interface BookingTimeSlotsGridProps {
    accentColor: string;
    slotStarts: string[];
    selectedTime: string;
    onSelectTime: (time: string) => void;
}

export function BookingTimeSlotsGrid({
    accentColor,
    slotStarts,
    selectedTime,
    onSelectTime,
}: Readonly<BookingTimeSlotsGridProps>) {
    return (
        <fieldset
            className="mt-3 grid grid-cols-3 gap-2 border-0 p-0 sm:grid-cols-4 md:grid-cols-5"
            aria-label="Horários disponíveis"
        >
            {slotStarts.map((t) => {
                const active = selectedTime === t;
                return (
                    <button
                        key={t}
                        type="button"
                        onClick={() => onSelectTime(t)}
                        className={`
                            rounded border px-2 py-2 text-sm font-medium transition-colors
                            ${
                                active
                                    ? 'border-transparent text-white'
                                    : 'border-gray-200 bg-green-50 text-custom-black-200 hover:bg-green-100'
                            }
                        `}
                        style={active ? { backgroundColor: accentColor } : undefined}
                    >
                        {t}
                    </button>
                );
            })}
        </fieldset>
    );
}
