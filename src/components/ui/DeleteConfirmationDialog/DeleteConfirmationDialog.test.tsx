import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmationDialog from './index';

describe('DeleteConfirmationDialog', () => {
  it('chama onClose e onConfirm', () => {
    const onClose = jest.fn();
    const onConfirm = jest.fn();

    render(
      <DeleteConfirmationDialog
        open
        onClose={onClose}
        onConfirm={onConfirm}
        title="Excluir item"
        itemName="Teste"
      />,
    );

    fireEvent.click(screen.getByTestId('cancel-remove'));
    expect(onClose).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('confirm-remove'));
    expect(onConfirm).toHaveBeenCalled();
  });
});
