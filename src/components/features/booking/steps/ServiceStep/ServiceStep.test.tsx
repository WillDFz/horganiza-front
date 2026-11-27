import { fireEvent, render, screen } from '@testing-library/react';
import { createMockService } from '@/utils/test';

import { ServiceStep } from './index';

describe('ServiceStep', () => {
    it('dispara próximo passo', () => {
        const onNext = jest.fn();

        render(
            <ServiceStep
                accentColor="#555555"
                services={[
                    createMockService({
                        id: 'svc-1',
                        name: 'Corte',
                        price: 50,
                        business_id: 'biz-1',
                        duration: 30,
                    }),
                ]}
                primaryServiceId="svc-1"
                onSelectService={jest.fn()}
                onNext={onNext}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Próximo →' }));
        expect(onNext).toHaveBeenCalledTimes(1);
    });
});
