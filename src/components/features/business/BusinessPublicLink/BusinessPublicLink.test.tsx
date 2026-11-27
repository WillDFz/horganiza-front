import { render, screen } from '@testing-library/react';
import BusinessPublicLink from './index';

describe('BusinessPublicLink', () => {
    it('renders public path and link when slug is provided', () => {
        render(<BusinessPublicLink slug="meu-salao" />);

        expect(screen.getByRole('link', { name: /ver página pública/i })).toHaveAttribute(
            'href',
            '/business/meu-salao',
        );
        expect(screen.getByRole('link', { name: /ver página pública/i })).toHaveAttribute(
            'target',
            '_blank',
        );
    });

    it('renders placeholder when slug is empty', () => {
        render(<BusinessPublicLink slug="" />);

        expect(screen.getByText(/defina a url do negócio/i)).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /ver página pública/i })).not.toBeInTheDocument();
    });
});
