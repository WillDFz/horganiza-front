import { render, screen } from '@testing-library/react';
import BussinessPage from './page';

jest.mock('@/components/features/business/InfoForm', () => ({
  __esModule: true,
  default: function MockInfoForm() {
    return <div data-testid="business-component">Business Component</div>;
  },
}));

describe('Business Page', () => {
  it('should render Business component', () => {
    render(<BussinessPage />);

    expect(screen.getByTestId('business-component')).toBeInTheDocument();
  });

  it('should render Business inside page container', () => {
    const { container } = render(<BussinessPage />);

    const outer = container.firstElementChild;
    expect(outer?.querySelector('[data-testid="business-component"]')).toBeInTheDocument();
  });
});
