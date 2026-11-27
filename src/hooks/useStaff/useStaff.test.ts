import { renderHook, act } from '@testing-library/react';
import { useStaff } from './index';
import { StaffService } from '@/services/staff/staff.service';
import { StaffMember } from '@/types/api/staff.types';
import { toast } from 'react-toastify';

jest.mock('@/services/staff/staff.service');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('useStaff', () => {
  let mockStaffService: jest.Mocked<StaffService>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockStaffService = {
      getStaffMembers: jest.fn(),
      createStaffMember: jest.fn(),
      updateStaffMember: jest.fn(),
      deleteStaffMember: jest.fn(),
      getWeekdays: jest.fn(),
      updateWeekday: jest.fn(),
    } as unknown as jest.Mocked<StaffService>;

    (StaffService as jest.Mock).mockImplementation(() => mockStaffService);
  });

  describe('initial state', () => {
    it('should have empty staffMembers and loading false', () => {
      const { result } = renderHook(() => useStaff());

      expect(result.current.staffMembers).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('getStaffMembers', () => {
    it('should fetch and set staff members', async () => {
      const mockStaffMembers: StaffMember[] = [
        {
          id: '1',
          name: 'Test Staff',
          email: 'staff@test.com',
          phone: '123456789',
          role: 'Atendente',
          business_id: '1',
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          staffMemberWeekDaySchedule: [],
        },
      ];

      mockStaffService.getStaffMembers.mockResolvedValue(mockStaffMembers);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        const data = await result.current.getStaffMembers();
        expect(data).toEqual(mockStaffMembers);
      });

      expect(mockStaffService.getStaffMembers).toHaveBeenCalled();
      expect(result.current.staffMembers).toEqual(mockStaffMembers);
      expect(result.current.loading).toBe(false);
    });

    it('should handle error when fetching staff members', async () => {
      const error = new Error('Failed to fetch');
      mockStaffService.getStaffMembers.mockRejectedValue(error);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        await expect(result.current.getStaffMembers()).rejects.toThrow();
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar os funcionários');
    });
  });

  describe('createStaffMember', () => {
    it('should create staff member successfully', async () => {
      const createStaffData = {
        name: 'New Staff',
        email: 'new@test.com',
        phone: '123456789',
        role: 'Atendente',
        password: 'password123',
        business_id: '1',
      };

      const mockResponse: StaffMember = {
        id: '1',
        name: createStaffData.name,
        email: createStaffData.email,
        phone: createStaffData.phone,
        role: createStaffData.role,
        business_id: createStaffData.business_id,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        staffMemberWeekDaySchedule: [],
      };

      mockStaffService.createStaffMember.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        const data = await result.current.createStaffMember(createStaffData);
        expect(data).toEqual(mockResponse);
      });

      expect(mockStaffService.createStaffMember).toHaveBeenCalledWith(createStaffData);
      expect(toast.success).toHaveBeenCalledWith('Atendente adicionado com sucesso');
    });

    it('should handle error when creating staff member', async () => {
      const createStaffData = {
        name: 'New Staff',
        email: 'new@test.com',
        phone: '123456789',
        role: 'Atendente',
        password: 'password123',
        business_id: '1',
      };

      const error = new Error('Failed to create');
      mockStaffService.createStaffMember.mockRejectedValue(error);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        await expect(result.current.createStaffMember(createStaffData)).rejects.toThrow();
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao adicionar o atendente');
    });
  });

  describe('updateStaffMember', () => {
    it('should update staff member successfully', async () => {
      const staffMember: StaffMember = {
        id: '1',
        name: 'Updated Staff',
        email: 'updated@test.com',
        phone: '123456789',
        role: 'Administrador',
        business_id: '1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        staffMemberWeekDaySchedule: [],
      };

      mockStaffService.updateStaffMember.mockResolvedValue(staffMember);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        const data = await result.current.updateStaffMember(staffMember);
        expect(data).toEqual(staffMember);
      });

      expect(mockStaffService.updateStaffMember).toHaveBeenCalledWith(staffMember);
      expect(toast.success).toHaveBeenCalledWith('Atendente atualizado com sucesso');
    });

    it('should handle error when updating staff member', async () => {
      const staffMember: StaffMember = {
        id: '1',
        name: 'Updated Staff',
        email: 'updated@test.com',
        phone: '123456789',
        role: 'Administrador',
        business_id: '1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        staffMemberWeekDaySchedule: [],
      };

      const error = new Error('Failed to update');
      mockStaffService.updateStaffMember.mockRejectedValue(error);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        await expect(result.current.updateStaffMember(staffMember)).rejects.toThrow();
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar o atendente');
    });
  });

  describe('deleteStaffMember', () => {
    it('should delete staff member successfully', async () => {
      mockStaffService.deleteStaffMember.mockResolvedValue(undefined);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        await result.current.deleteStaffMember('1');
      });

      expect(mockStaffService.deleteStaffMember).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Atendente deletado com sucesso');
    });

    it('should handle error when deleting staff member', async () => {
      const error = new Error('Failed to delete');
      mockStaffService.deleteStaffMember.mockRejectedValue(error);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        await expect(result.current.deleteStaffMember('1')).rejects.toThrow();
      });

      expect(toast.error).toHaveBeenCalledWith('Erro ao deletar o atendente');
    });
  });

  describe('getWeekdays', () => {
    it('returns weekdays', async () => {
      const rows = [
        {
          id: '1',
          week_day: 'MONDAY',
          staff_id: 's',
          start_time: '09:00',
          end_time: '18:00',
          is_active: true,
        },
      ];
      mockStaffService.getWeekdays.mockResolvedValue(rows);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        const data = await result.current.getWeekdays('s');
        expect(data).toEqual(rows);
      });
    });

    it('toasts on error', async () => {
      mockStaffService.getWeekdays.mockRejectedValue(new Error('x'));
      const { result } = renderHook(() => useStaff());

      await act(async () => {
        await expect(result.current.getWeekdays('s')).rejects.toThrow();
      });
      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar os horários do atendente');
    });
  });

  describe('updateWeekday', () => {
    it('updates weekday', async () => {
      const w = {
        id: '1',
        week_day: 'MONDAY',
        staff_id: 's',
        start_time: '10:00',
        end_time: '18:00',
        is_active: true,
      };
      mockStaffService.updateWeekday.mockResolvedValue(w);

      const { result } = renderHook(() => useStaff());

      await act(async () => {
        const data = await result.current.updateWeekday(w);
        expect(data).toEqual(w);
      });
      expect(toast.success).toHaveBeenCalledWith('Horário atualizado com sucesso');
    });

    it('toasts on error', async () => {
      const w = {
        id: '1',
        week_day: 'MONDAY',
        staff_id: 's',
        start_time: '10:00',
        end_time: '18:00',
        is_active: true,
      };
      mockStaffService.updateWeekday.mockRejectedValue(new Error('x'));
      const { result } = renderHook(() => useStaff());

      await act(async () => {
        await expect(result.current.updateWeekday(w)).rejects.toThrow();
      });
      expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar o horário');
    });
  });
});

