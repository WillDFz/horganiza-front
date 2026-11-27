import { render, screen } from '@testing-library/react';
import LoadingState from './index';

describe('LoadingState', () => {
    it('renders progress indicator', () => {
        render(<LoadingState />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
