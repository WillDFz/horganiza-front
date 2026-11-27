import { CustomerSession, UserSession, RegisterResponse } from '@/types/api/auth.types';
import { Business } from '@/types/api/business.types';
import { Service } from '@/types/api/services.types';
import { StaffMember } from '@/types/api/staff.types';

/**
 * Factory para criar objetos mock de UserSession
 */
export const createMockUserSession = (overrides?: Partial<UserSession>): UserSession => ({
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  phone: '123456789',
  role: 'USER',
  business_id: '1',
  confirmed_email: false,
  ...overrides,
});

export const createMockCustomerSession = (
  overrides?: Partial<CustomerSession>,
): CustomerSession => ({
  id: '1',
  name: 'Test Customer',
  email: 'customer@test.com',
  phone: '123456789',
  role: 'CUSTOMER',
  business_id: '1',
  confirmed_email: false,
  ...overrides,
});

/**
 * Factory para criar objetos mock de LoginResponse (do hook useAuth)
 */
export const createMockLoginResponse = (overrides?: Partial<{ id: string; name: string; email: string; phone: string }>) => ({
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  phone: '123456789',
  ...overrides,
});

/**
 * Factory para criar objetos mock de LoginResponse do AuthService
 */
export const createMockAuthServiceLoginResponse = (overrides?: Partial<{ id: string; name: string; email: string; phone: string; address: string; created_at: string; updated_at: string }>) => ({
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  phone: '123456789',
  address: 'Test Address',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});

/**
 * Factory para criar objetos mock de RegisterResponse
 */
export const createMockRegisterResponse = (overrides?: Partial<RegisterResponse>): RegisterResponse => ({
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  phone: '123456789',
  password: 'password123',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});

/**
 * Factory para criar objetos mock de Business
 */
export const createMockBusiness = (overrides?: Partial<Business>): Business => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  business_id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Business',
  url: 'test-business',
  interval_minutes: 30,
  primary_color: '#000000',
  secondary_color: '#ffffff',
  contact_email: 'test@test.com',
  phone: '123456789',
  instagram_url: '',
  facebook_url: '',
  logo: '',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});

/**
 * Factory para criar objetos mock de Service
 */
export const createMockService = (overrides?: Partial<Service>): Service => ({
  id: '1',
  name: 'Test Service',
  price: 50,
  business_id: '1',
  duration: 30,
  has_staff: true,
  parent_id: '',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});

/**
 * Factory para criar objetos mock de StaffMember
 */
export const createMockStaffMember = (overrides?: Partial<StaffMember>): StaffMember => ({
  id: '1',
  name: 'Test Staff',
  email: 'staff@test.com',
  phone: '123456789',
  role: 'Atendente',
  business_id: '1',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  staffMemberWeekDaySchedule: [],
  ...overrides,
});

/**
 * Factory para criar array de StaffMembers
 */
export const createMockStaffMembers = (count = 2, overrides?: Partial<StaffMember>): StaffMember[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockStaffMember({
      id: String(index + 1),
      name: `Test Staff ${index + 1}`,
      email: `staff${index + 1}@test.com`,
      ...overrides,
    })
  );
};

