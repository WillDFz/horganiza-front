import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomerLayout from './index';

jest.mock('@/utils/RouteGuard/Customer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="guard">{children}</div>,
}));

describe('CustomerLayout', () => {
  it('renders children inside guard', () => {
    render(
      <CustomerLayout business_slug="acme">
        <span>Inner</span>
      </CustomerLayout>,
    );

    expect(screen.getByTestId('guard')).toContainElement(screen.getByText('Inner'));
  });
});
