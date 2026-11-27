import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StaffList from './index';
import { useStaff } from '@/hooks/useStaff';
import { useAuth } from '@/contexts/auth-context';
import {
  createMockStaffMembers,
  createMockUseAuth,
  createMockUseStaff,
  createMockUserSession,
} from '@/utils/test';

jest.mock('@/hooks/useStaff', () => ({
  useStaff: jest.fn(),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(() => false),
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean; onClose?: () => void }) => (
    open ? <div data-testid="dialog">{children}</div> : null
  ),
}));

describe('StaffList', () => {
  const mockGetStaffMembers = jest.fn();
  const mockDeleteStaffMember = jest.fn();
  const mockGetUserSession = jest.fn();
  const mockUseStaff = useStaff as jest.MockedFunction<typeof useStaff>;
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  const mockStaffMembers = createMockStaffMembers(2, {
    name: 'John Doe',
    email: 'john@example.com',
  }).map((member, index) => {
    if (index === 1) {
      return {
        ...member,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Administrador',
      };
    }
    return member;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStaff.mockReturnValue(createMockUseStaff({
      getStaffMembers: mockGetStaffMembers,
      deleteStaffMember: mockDeleteStaffMember,
      staffMembers: [],
    }));

    const mockAuth = createMockUseAuth({
      getUserSession: mockGetUserSession,
      isAuthenticated: true,
    });
    mockUseAuth.mockReturnValue(mockAuth);

    mockGetUserSession.mockResolvedValue(createMockUserSession({
      name: 'Test',
      email: 'test@example.com',
      phone: '123',
    }));

    mockGetStaffMembers.mockResolvedValue(mockStaffMembers);
  });

  it('should render staff list component', () => {
    render(<StaffList />);

    expect(screen.getByRole('heading', { name: /atendentes/i })).toBeInTheDocument();
  });

  it('should render add staff member button', () => {
    render(<StaffList />);

    const addButton = screen.getByText(/adicionar atendente/i);
    expect(addButton).toBeInTheDocument();
  });

  it('should display staff members in table', async () => {
    render(<StaffList />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });
  });

  it('should show empty state when no staff members', async () => {
    mockGetStaffMembers.mockResolvedValue([]);

    render(<StaffList />);

    await waitFor(() => {
      expect(screen.getByText(/nenhum atendente cadastrado/i)).toBeInTheDocument();
    });
  });

  it('should open delete dialog when delete button is clicked', async () => {
    render(<StaffList />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/excluir/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
      expect(screen.getByText(/deseja realmente remover/i)).toBeInTheDocument();
    });
  });

  it('should delete staff member when confirmed', async () => {
    mockDeleteStaffMember.mockResolvedValue({});

    render(<StaffList />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/excluir/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('confirm-remove');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteStaffMember).toHaveBeenCalledWith('1');
    });
  });

  it('should close delete dialog when cancel is clicked', async () => {
    render(<StaffList />);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText(/excluir/i);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId('cancel-remove');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });
  });
});

