import { render, screen } from '@testing-library/react';

import { InstructionPanel } from './index';

describe('InstructionPanel', () => {
    it('renderiza conteúdo principal', () => {
        render(
            <InstructionPanel
                accentColor="#000000"
                icon={<span>i</span>}
                title="Título"
                body="Descrição"
                supportPhone="(11) 99999-9999"
            />,
        );

        expect(screen.getByText('Título')).toBeInTheDocument();
        expect(screen.getByText('Descrição')).toBeInTheDocument();
    });
});
