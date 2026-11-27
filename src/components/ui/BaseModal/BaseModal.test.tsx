import { render, screen, fireEvent } from '@testing-library/react';
import BaseModal from './index';

describe('BaseModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal when open is true', () => {
    render(
      <BaseModal open={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('should not render modal content when open is false', () => {
    render(
      <BaseModal open={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
  });

  it('should call onClose when modal is closed', () => {
    render(
      <BaseModal open={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    const modal = screen.getByRole('presentation');
    fireEvent.keyDown(modal, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should apply correct size class for md size', () => {
    render(
      <BaseModal open={true} onClose={mockOnClose} size="md">
        <div>Modal Content</div>
      </BaseModal>
    );

    const modalContent = screen.getByText(/modal content/i).closest('.max-w-md');
    expect(modalContent).toBeInTheDocument();
  });

  it('should apply correct size class for lg size', () => {
    render(
      <BaseModal open={true} onClose={mockOnClose} size="lg">
        <div>Modal Content</div>
      </BaseModal>
    );

    const modalContent = screen.getByText(/modal content/i).closest('.max-w-lg');
    expect(modalContent).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <BaseModal open={true} onClose={mockOnClose} className="custom-class">
        <div>Modal Content</div>
      </BaseModal>
    );

    const modalContent = screen.getByText(/modal content/i).closest('.custom-class');
    expect(modalContent).toBeInTheDocument();
  });
});

