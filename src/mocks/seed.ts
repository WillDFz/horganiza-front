import type { Appointment } from '@/types/api/appointments.types';
import type { UserSession, CustomerSession, LoginResponse } from '@/types/api/auth.types';
import type { Business } from '@/types/api/business.types';
import type { Customer } from '@/types/api/customer.types';
import type { Service } from '@/types/api/services.types';
import type { StaffMember, Weekday } from '@/types/api/staff.types';
import {
  BUSINESS_ID,
  CUSTOMER_SESSION_ID,
  DEMO_BUSINESS_SLUG,
  DEMO_EMAIL,
  DEMO_PLACEHOLDER_IMAGE,
  OWNER_USER_ID,
} from './constants';

const now = new Date();
const isoDaysFromNow = (days: number, hour: number, minute = 0): string => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const stamp = '2024-01-15T12:00:00.000Z';

function buildWeekSchedule(staffId: string): Weekday[] {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
  return days.map((week_day, index) => ({
    id: `sched-${staffId}-${index}`,
    week_day,
    staff_id: staffId,
    start_time: '09:00',
    end_time: '18:00',
    is_active: true,
  }));
}

export const seedBusiness: Business = {
  id: BUSINESS_ID,
  business_id: BUSINESS_ID,
  name: 'Estúdio Aurora',
  url: DEMO_BUSINESS_SLUG,
  interval_minutes: 30,
  primary_color: '#0f766e',
  secondary_color: '#f0fdfa',
  contact_email: 'contato@estudioaurora.demo',
  phone: '(11) 98888-0000',
  instagram_url: 'https://instagram.com/estudioaurora',
  facebook_url: '',
  logo: DEMO_PLACEHOLDER_IMAGE,
  created_at: stamp,
  updated_at: stamp,
};

export const seedOwnerSession: UserSession = {
  id: OWNER_USER_ID,
  name: 'Ana Demo',
  email: DEMO_EMAIL,
  phone: '(11) 98888-0001',
  role: 'USER',
  business_id: BUSINESS_ID,
  confirmed_email: true,
};

export const seedLoginResponse: LoginResponse = {
  id: OWNER_USER_ID,
  name: 'Ana Demo',
  phone: '(11) 98888-0001',
  address: 'Rua das Flores, 100 — São Paulo, SP',
  email: DEMO_EMAIL,
  created_at: stamp,
  updated_at: stamp,
};

export const seedCustomerSession: CustomerSession = {
  id: CUSTOMER_SESSION_ID,
  name: 'Cliente Demo',
  email: 'cliente@demo.app',
  phone: '(11) 97777-0000',
  role: 'CUSTOMER',
  business_id: BUSINESS_ID,
  confirmed_email: true,
};

export const seedStaff: StaffMember[] = [
  {
    id: 'staff-001',
    name: 'Marina Costa',
    email: 'marina@estudioaurora.demo',
    phone: '(11) 91111-0001',
    role: 'Atendente',
    business_id: BUSINESS_ID,
    created_at: stamp,
    updated_at: stamp,
    staffMemberWeekDaySchedule: buildWeekSchedule('staff-001'),
  },
  {
    id: 'staff-002',
    name: 'Pedro Lima',
    email: 'pedro@estudioaurora.demo',
    phone: '(11) 91111-0002',
    role: 'Atendente',
    business_id: BUSINESS_ID,
    created_at: stamp,
    updated_at: stamp,
    staffMemberWeekDaySchedule: buildWeekSchedule('staff-002'),
  },
];

export const seedServices: Service[] = [
  {
    id: 'svc-001',
    name: 'Corte e finalização',
    description: 'Corte personalizado com finalização.',
    price: 80,
    business_id: BUSINESS_ID,
    has_staff: true,
    duration: 45,
    parent_id: '',
    image: DEMO_PLACEHOLDER_IMAGE,
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: 'svc-002',
    name: 'Coloração',
    description: 'Coloração completa com tratamento.',
    price: 180,
    promotional_price: 150,
    business_id: BUSINESS_ID,
    has_staff: true,
    duration: 90,
    parent_id: '',
    image: DEMO_PLACEHOLDER_IMAGE,
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: 'svc-003',
    name: 'Hidratação express',
    description: 'Tratamento rápido de hidratação.',
    price: 60,
    business_id: BUSINESS_ID,
    has_staff: true,
    duration: 30,
    parent_id: 'svc-001',
    created_at: stamp,
    updated_at: stamp,
  },
];

export const seedCustomers: Customer[] = [
  {
    id: 'cust-001',
    email: 'julia.santos@demo.app',
    business_id: BUSINESS_ID,
    confirmed_email: true,
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: 'cust-002',
    email: 'rafael.alves@demo.app',
    business_id: BUSINESS_ID,
    confirmed_email: true,
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: CUSTOMER_SESSION_ID,
    email: 'cliente@demo.app',
    business_id: BUSINESS_ID,
    confirmed_email: true,
    created_at: stamp,
    updated_at: stamp,
  },
];

export const seedAppointments: Appointment[] = [
  {
    id: 'appt-001',
    business_id: BUSINESS_ID,
    staff_member_id: 'staff-001',
    customer_id: 'cust-001',
    service_id: 'svc-001',
    status: 'CONFIRMED',
    schedule_time: isoDaysFromNow(1, 10, 0),
    customer_name: 'Júlia Santos',
    notes: 'Primeira visita',
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: 'appt-002',
    business_id: BUSINESS_ID,
    staff_member_id: 'staff-002',
    customer_id: 'cust-002',
    service_id: 'svc-002',
    extra_service_ids: ['svc-003'],
    status: 'SCHEDULED',
    schedule_time: isoDaysFromNow(2, 14, 30),
    customer_name: 'Rafael Alves',
    created_at: stamp,
    updated_at: stamp,
  },
  {
    id: 'appt-003',
    business_id: BUSINESS_ID,
    staff_member_id: 'staff-001',
    customer_id: 'cust-001',
    service_id: 'svc-003',
    status: 'COMPLETED',
    schedule_time: isoDaysFromNow(-2, 11, 0),
    customer_name: 'Júlia Santos',
    created_at: stamp,
    updated_at: stamp,
  },
];
