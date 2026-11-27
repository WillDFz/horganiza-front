import { render, screen } from '@testing-library/react';
import ServicesPage from './page';

jest.mock('@/components/features/services/ServicesList', () => ({
  __esModule: true,
  default: () => <div data-testid="services-list">ServicesList</div>,
}));

describe('ServicesPage', () => {
  it('renderiza a lista de serviços', () => {
    render(<ServicesPage />);
    expect(screen.getByTestId('services-list')).toBeInTheDocument();
  });
});
