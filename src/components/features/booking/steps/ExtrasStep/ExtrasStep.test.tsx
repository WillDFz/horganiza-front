import { fireEvent, render, screen } from '@testing-library/react';
import { createMockService } from '@/utils/test';

import { ExtrasStep } from './index';

describe('ExtrasStep', () => {
    it('permite avançar para próxima etapa', () => {
        const onNext = jest.fn();

        render(
            <ExtrasStep
                accentColor="#888888"
                services={[
                    createMockService({
                        id: 'svc-1',
                        name: 'Corte',
                        price: 50,
                        business_id: 'biz-1',
                        duration: 30,
                    }),
                    createMockService({
                        id: 'svc-2',
                        name: 'Barba',
                        price: 30,
                        business_id: 'biz-1',
                        duration: 20,
                    }),
                ]}
                primaryServiceId="svc-1"
                extraIds={[]}
                onToggleExtra={jest.fn()}
                onBack={jest.fn()}
                onNext={onNext}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: 'Próximo →' }));
        expect(onNext).toHaveBeenCalledTimes(1);
    });
});
