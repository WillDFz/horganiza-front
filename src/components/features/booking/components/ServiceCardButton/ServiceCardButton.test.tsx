import { fireEvent, render, screen } from '@testing-library/react';
import { createMockService } from '@/utils/test';

import { ServiceCardButton } from './index';

describe('ServiceCardButton', () => {
    it('renderiza serviço e dispara seleção', () => {
        const onSelect = jest.fn();

        render(
            <ServiceCardButton
                service={createMockService({
                    id: 'svc-1',
                    name: 'Corte',
                    price: 50,
                    business_id: 'biz-1',
                    duration: 30,
                })}
                accentColor="#111111"
                selected={false}
                onSelect={onSelect}
            />,
        );

        fireEvent.click(screen.getByRole('button'));
        expect(onSelect).toHaveBeenCalledTimes(1);
    });
});
