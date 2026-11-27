export interface CalendarCell {
    date: Date;
    inMonth: boolean;
}

/** Grelha 6×7 para o mês visível (inclui dias fora do mês). */
export function calendarGridDays(visibleMonth: Date): CalendarCell[] {
    const y = visibleMonth.getFullYear();
    const m = visibleMonth.getMonth();
    const first = new Date(y, m, 1);
    const startPad = first.getDay();
    const last = new Date(y, m + 1, 0);
    const daysInMonth = last.getDate();
    const cells: CalendarCell[] = [];
    for (let i = 0; i < startPad; i++) {
        const d = new Date(y, m, -startPad + i + 1);
        cells.push({ date: d, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({ date: new Date(y, m, day), inMonth: true });
    }
    while (cells.length < 42) {
        const lastCell = cells[cells.length - 1];
        const next = new Date(lastCell.date);
        next.setDate(next.getDate() + 1);
        cells.push({ date: next, inMonth: false });
    }
    return cells;
}
