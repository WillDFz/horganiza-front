import { render, screen } from '@testing-library/react';
import CustomerLoginPage from './page';

jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'minha-loja' }),
}));

jest.mock('@/components/auth/Customer/Login', () => ({
  __esModule: true,
  default: ({ business_slug }: { business_slug: string }) => (
    <div data-testid="customer-login-form">slug:{business_slug}</div>
  ),
}));

describe('CustomerLoginPage', () => {
  it('passa o slug para o formulário', () => {
    render(<CustomerLoginPage />);
    expect(screen.getByTestId('customer-login-form')).toHaveTextContent('slug:minha-loja');
  });
});
