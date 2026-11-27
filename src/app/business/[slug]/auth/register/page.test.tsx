import { render, screen } from '@testing-library/react';
import CustomerRegisterPage from './page';

jest.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'minha-loja' }),
}));

jest.mock('@/components/auth/Customer/Register', () => ({
  __esModule: true,
  default: ({ business_slug }: { business_slug: string }) => (
    <div data-testid="customer-register-form">slug:{business_slug}</div>
  ),
}));

describe('CustomerRegisterPage', () => {
  it('passa o slug para o formulário', () => {
    render(<CustomerRegisterPage />);
    expect(screen.getByTestId('customer-register-form')).toHaveTextContent('slug:minha-loja');
  });
});
