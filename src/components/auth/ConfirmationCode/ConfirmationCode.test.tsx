import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationCode from './index';

describe('ConfirmationCode', () => {
  it('calls setConfirmationCode on input', () => {
    const setConfirmationCode = jest.fn();
    render(
      <ConfirmationCode confirmationCode="" setConfirmationCode={setConfirmationCode} />,
    );

    fireEvent.change(screen.getByLabelText(/código de confirmação/i), {
      target: { value: '123456' },
    });

    expect(setConfirmationCode).toHaveBeenCalledWith('123456');
  });

  it('respects disabled', () => {
    render(
      <ConfirmationCode
        confirmationCode="abc"
        setConfirmationCode={jest.fn()}
        disabled
      />,
    );

    expect(screen.getByLabelText(/código de confirmação/i)).toBeDisabled();
  });
});
