import { fireEvent, render, screen } from '@testing-library/react';
import CustomerAuthFormShell from './index';

const businessInfo = {
  id: 'b1',
  business_id: 'b1',
  name: 'Loja Teste',
  logo: '',
};

describe('CustomerAuthFormShell', () => {
  it('exibe loading', () => {
    render(
      <CustomerAuthFormShell
        loading
        error={null}
        businessInfo={null}
        onSubmit={jest.fn()}
        footerLink={{ href: '/login', label: 'Entrar' }}
      >
        <input aria-label="campo" />
      </CustomerAuthFormShell>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByLabelText('campo')).not.toBeInTheDocument();
  });

  it('exibe erro', () => {
    render(
      <CustomerAuthFormShell
        loading={false}
        error="Falha ao carregar"
        businessInfo={null}
        onSubmit={jest.fn()}
        footerLink={{ href: '/login', label: 'Entrar' }}
      >
        <input aria-label="campo" />
      </CustomerAuthFormShell>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Falha ao carregar');
  });

  it('renderiza formulário com cabeçalho, campos e link do rodapé', () => {
    const onSubmit = jest.fn((e) => e.preventDefault());

    render(
      <CustomerAuthFormShell
        loading={false}
        error={null}
        businessInfo={businessInfo}
        onSubmit={onSubmit}
        footerLink={{ href: '/register', label: 'Cadastre-se' }}
      >
        <input aria-label="email" />
      </CustomerAuthFormShell>,
    );

    expect(screen.getByRole('heading', { name: 'Loja Teste' })).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cadastre-se' })).toHaveAttribute(
      'href',
      '/register',
    );

    const form = screen.getByLabelText('email').closest('form');
    fireEvent.submit(form!);
    expect(onSubmit).toHaveBeenCalled();
  });
});
