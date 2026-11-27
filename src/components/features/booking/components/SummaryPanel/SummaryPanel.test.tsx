import { render, screen } from '@testing-library/react';
import { createMockService } from '@/utils/test';

import { SummaryPanel } from './index';

describe('SummaryPanel', () => {
    it('renderiza resumo com serviço principal', () => {
        render(
            <SummaryPanel
                accentColor="#444444"
                primary={createMockService({
                    id: 'svc-1',
                    name: 'Corte',
                    price: 50,
                    business_id: 'biz-1',
                    duration: 30,
                })}
                extras={[]}
                lineItems={[{ id: 'svc-1', label: 'Corte', price: 50 }]}
                totalPrice={50}
                bookingDate={new Date(2026, 4, 10)}
                customerTime="10:00"
            />,
        );

        expect(screen.getByText('Resumo')).toBeInTheDocument();
        expect(screen.getAllByText('Corte')).toHaveLength(2);
    });
});
