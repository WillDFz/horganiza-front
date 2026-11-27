import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ServicesList from './index';
import { createMockService } from '@/utils/test';
import type { Service } from '@/types/api/services.types';

const mockGetServices = jest.fn().mockResolvedValue(undefined);
const mockDeleteService = jest.fn().mockResolvedValue(undefined);

const mockServices: Service[] = [
  createMockService({ id: 'svc-1', name: 'Corte' }),
  createMockService({ id: 'svc-2', name: 'Barba' }),
];

jest.mock('@/hooks/useService', () => ({
  useService: () => ({
    getServices: mockGetServices,
    deleteService: mockDeleteService,
    services: mockServices,
    loading: false,
    createService: jest.fn(),
    updateService: jest.fn(),
  }),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => true),
}));

jest.mock('../Create', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="create-service-modal">
      <button type="button" onClick={onClose}>
        Fechar criar
      </button>
    </div>
  ),
}));

jest.mock('./ServiceCard', () => ({
  __esModule: true,
  default: ({
    service,
    onEdit,
    onDelete,
  }: {
    service: Service;
    onEdit: (s: Service) => void;
    onDelete: (s: Service) => void;
  }) => (
    <div data-testid="service-card">
      <span>{service.name}</span>
      <button type="button" onClick={() => onEdit(service)}>
        Editar {service.name}
      </button>
      <button type="button" onClick={() => onDelete(service)}>
        Excluir {service.name}
      </button>
    </div>
  ),
}));

describe('ServicesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza busca e lista de serviços', async () => {
    render(<ServicesList />);

    expect(screen.getByPlaceholderText(/pesquisar/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Corte')).toBeInTheDocument();
      expect(screen.getByText('Barba')).toBeInTheDocument();
    });
  });

  it('abre modal de criação', async () => {
    render(<ServicesList />);

    fireEvent.click(screen.getByRole('button', { name: /serviço/i }));

    expect(screen.getByTestId('create-service-modal')).toBeInTheDocument();
  });

  it('confirma exclusão de serviço', async () => {
    render(<ServicesList />);

    await waitFor(() => screen.getByText('Corte'));

    fireEvent.click(screen.getByRole('button', { name: /excluir corte/i }));

    expect(screen.getByText(/deseja realmente remover o serviço corte/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-remove'));

    await waitFor(() => {
      expect(mockDeleteService).toHaveBeenCalledWith('svc-1');
    });
  });
});
