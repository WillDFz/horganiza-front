import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreateService from './index';
import { createMockService } from '@/utils/test';

const mockCreateService = jest.fn().mockResolvedValue({});
const mockUpdateService = jest.fn().mockResolvedValue({});

jest.mock('@/hooks/useService', () => ({
  useService: () => ({
    createService: mockCreateService,
    updateService: mockUpdateService,
    loading: false,
    getServices: jest.fn(),
    deleteService: jest.fn(),
    services: [],
  }),
}));

describe('CreateService', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza campos do formulário', () => {
    render(<CreateService onClose={onClose} />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar serviço/i })).toBeInTheDocument();
  });

  it('cria serviço ao enviar formulário válido', async () => {
    render(<CreateService onClose={onClose} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByRole('textbox', { name: /^nome$/i }), { target: { value: 'Barba' } });
    fireEvent.change(screen.getByRole('textbox', { name: /^preço$/i }), { target: { value: '35,00' } });
    fireEvent.change(screen.getByLabelText(/duração/i), { target: { value: '20' } });

    fireEvent.click(screen.getByRole('button', { name: /criar serviço/i }));

    await waitFor(() => {
      expect(mockCreateService).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Barba',
          price: 35,
          duration: 20,
        }),
      );
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('renderiza modo edição e atualiza serviço', async () => {
    const service = createMockService({
      id: 'svc-99',
      name: 'Corte',
      price: 50,
      duration: 45,
      quantity: 1,
    });

    render(
      <CreateService
        serviceToEdit={service}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    );

    expect(screen.getByRole('heading', { name: /editar serviço/i })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: /^nome$/i }), { target: { value: 'Corte premium' } });
    fireEvent.click(screen.getByRole('button', { name: /atualizar serviço/i }));

    await waitFor(() => {
      expect(mockUpdateService).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'svc-99',
          name: 'Corte premium',
        }),
      );
    });
  });

  it('exibe campos de período promocional quando há preço promocional', () => {
    render(<CreateService onClose={onClose} />);

    fireEvent.change(screen.getByLabelText(/preço promocional/i), { target: { value: '25,00' } });

    expect(screen.getByLabelText(/início da promoção/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fim da promoção/i)).toBeInTheDocument();
  });
});
