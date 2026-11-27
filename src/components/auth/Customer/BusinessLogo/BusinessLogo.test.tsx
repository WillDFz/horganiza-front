import { render, screen } from '@testing-library/react';
import BusinessLogo from './index';

describe('BusinessLogo', () => {
  it('renderiza imagem quando logo está definido', () => {
    render(<BusinessLogo logo="https://example.com/logo.png" />);

    expect(screen.getByRole('img', { name: 'Logo' })).toHaveAttribute(
      'src',
      'https://example.com/logo.png',
    );
  });

  it('renderiza placeholder quando logo não está definido', () => {
    render(<BusinessLogo />);

    expect(screen.getByLabelText('Logo indisponível')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Logo' })).not.toBeInTheDocument();
  });
});
