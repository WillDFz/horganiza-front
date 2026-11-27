import { render, screen } from '@testing-library/react';

import { CustomerStep } from './index';

describe('CustomerStep', () => {
    it('renderiza campos do cliente', () => {
        render(
            <CustomerStep
                accentColor="#777777"
                firstName=""
                lastName=""
                phoneDigits=""
                onFirstNameChange={jest.fn()}
                onLastNameChange={jest.fn()}
                onPhoneDigitsChange={jest.fn()}
                submitting={false}
                onBack={jest.fn()}
            />,
        );

        expect(screen.getByRole('textbox', { name: /Primeiro nome/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /Último nome/i })).toBeInTheDocument();
    });
});
