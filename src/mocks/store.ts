import type { Appointment, AppointmentStatus } from '@/types/api/appointments.types';
import type { Business } from '@/types/api/business.types';
import type { Customer } from '@/types/api/customer.types';
import type { CreateService, Service, UpdateService } from '@/types/api/services.types';
import type {
  AvailableScheduleSlot,
  CreateStaffMember,
  StaffMember,
  Weekday,
} from '@/types/api/staff.types';
import { getDayScheduleSlots } from '@/utils/staffScheduleSlots';
import { DEMO_PLACEHOLDER_IMAGE } from './constants';
import {
  seedAppointments,
  seedBusiness,
  seedCustomers,
  seedServices,
  seedStaff,
} from './seed';

export interface MockStore {
  business: Business;
  staff: StaffMember[];
  services: Service[];
  customers: Customer[];
  appointments: Appointment[];
}

declare global {
  var __horganizaMockStore: MockStore | undefined;
}

function cloneSeed(): MockStore {
  return {
    business: structuredClone(seedBusiness),
    staff: structuredClone(seedStaff),
    services: structuredClone(seedServices),
    customers: structuredClone(seedCustomers),
    appointments: structuredClone(seedAppointments),
  };
}

export function getStore(): MockStore {
  if (!globalThis.__horganizaMockStore) {
    globalThis.__horganizaMockStore = cloneSeed();
  }
  return globalThis.__horganizaMockStore;
}

export function resetStore(): void {
  globalThis.__horganizaMockStore = cloneSeed();
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function getBusiness(): Business {
  return getStore().business;
}

export function getBusinessBySlug(slug: string): Business | null {
  const business = getStore().business;
  return business.url === slug ? business : null;
}

export function updateBusiness(payload: Business): Business {
  const store = getStore();
  store.business = {
    ...store.business,
    ...payload,
    id: store.business.id,
    business_id: store.business.business_id,
    updated_at: nowIso(),
  };
  return store.business;
}

export function listStaff(): StaffMember[] {
  return getStore().staff;
}

export function getStaffById(id: string): StaffMember | null {
  return getStore().staff.find((member) => member.id === id) ?? null;
}

export function createStaff(payload: CreateStaffMember): StaffMember {
  const store = getStore();
  const id = newId('staff');
  const member: StaffMember = {
    id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    business_id: payload.business_id,
    created_at: nowIso(),
    updated_at: nowIso(),
    staffMemberWeekDaySchedule: [],
  };
  store.staff.push(member);
  return member;
}

export function updateStaff(payload: StaffMember): StaffMember {
  const store = getStore();
  const index = store.staff.findIndex((member) => member.id === payload.id);
  if (index < 0) {
    throw new Error('Staff member not found');
  }
  store.staff[index] = { ...payload, updated_at: nowIso() };
  return store.staff[index];
}

export function deleteStaff(id: string): void {
  const store = getStore();
  store.staff = store.staff.filter((member) => member.id !== id);
}

export function getStaffSchedule(staffId: string): Weekday[] {
  return getStaffById(staffId)?.staffMemberWeekDaySchedule ?? [];
}

export function updateWeekday(weekday: Weekday): Weekday {
  const store = getStore();
  const member = store.staff.find((item) => item.id === weekday.staff_id);
  if (!member) {
    throw new Error('Staff member not found');
  }
  const index = member.staffMemberWeekDaySchedule.findIndex((day) => day.id === weekday.id);
  if (index >= 0) {
    member.staffMemberWeekDaySchedule[index] = weekday;
  } else {
    member.staffMemberWeekDaySchedule.push(weekday);
  }
  member.updated_at = nowIso();
  return weekday;
}

export function listServices(query?: string): Service[] {
  const services = getStore().services;
  if (!query?.trim()) return services;
  const q = query.trim().toLowerCase();
  return services.filter((service) => service.name.toLowerCase().includes(q));
}

export function createService(payload: CreateService): Service {
  const store = getStore();
  const service: Service = {
    id: newId('svc'),
    name: payload.name,
    description: payload.description,
    price: payload.price,
    business_id: payload.business_id,
    promotional_price: payload.promotional_price,
    promotional_start_date: payload.promotional_start_date ?? null,
    promotional_end_date: payload.promotional_end_date ?? null,
    has_staff: payload.has_staff,
    duration: payload.duration,
    quantity: payload.quantity,
    image: payload.image,
    parent_id: payload.parent_id,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  store.services.push(service);
  return service;
}

export function updateService(payload: UpdateService): Service {
  const store = getStore();
  const index = store.services.findIndex((service) => service.id === payload.id);
  if (index < 0) {
    throw new Error('Service not found');
  }
  store.services[index] = {
    ...store.services[index],
    ...payload,
    updated_at: nowIso(),
  };
  return store.services[index];
}

export function deleteService(id: string): void {
  const store = getStore();
  store.services = store.services.filter((service) => service.id !== id);
}

export function listCustomers(): Customer[] {
  return getStore().customers;
}

export function listAppointments(businessId?: string): Appointment[] {
  const appointments = getStore().appointments;
  if (!businessId) return appointments;
  return appointments.filter((appointment) => appointment.business_id === businessId);
}

export function listAppointmentsByStaff(staffId: string, businessId: string): Appointment[] {
  return getStore().appointments.filter(
    (appointment) =>
      appointment.staff_member_id === staffId && appointment.business_id === businessId,
  );
}

export function getAppointmentById(id: string): Appointment | null {
  return getStore().appointments.find((appointment) => appointment.id === id) ?? null;
}

export function createAppointment(payload: Appointment): Appointment {
  const store = getStore();
  const appointment: Appointment = {
    ...payload,
    id: payload.id || newId('appt'),
    created_at: payload.created_at || nowIso(),
    updated_at: nowIso(),
  };
  store.appointments.push(appointment);
  return appointment;
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment {
  const store = getStore();
  const index = store.appointments.findIndex((appointment) => appointment.id === id);
  if (index < 0) {
    throw new Error('Appointment not found');
  }
  store.appointments[index] = {
    ...store.appointments[index],
    status,
    updated_at: nowIso(),
  };
  return store.appointments[index];
}

export function deleteAppointment(id: string): void {
  const store = getStore();
  store.appointments = store.appointments.filter((appointment) => appointment.id !== id);
}

/** Match production API shape: wall-clock HH:mm embedded in an ISO string (UTC Z). */
function toSlotIso(dateYyyyMmDd: string, hhmm: string): string {
  const normalized = hhmm.length === 5 ? hhmm : hhmm.padStart(5, '0');
  return `${dateYyyyMmDd}T${normalized}:00.000Z`;
}

export function getAvailableSlots(
  staffId: string,
  date: string,
  durationMinutes: number,
): AvailableScheduleSlot[] {
  const member = getStaffById(staffId);
  if (!member) return [];

  const dayPrefix = date.slice(0, 10);
  const day = new Date(`${dayPrefix}T12:00:00`);
  if (Number.isNaN(day.getTime())) return [];

  const { slotStarts, isDayActive } = getDayScheduleSlots(member.staffMemberWeekDaySchedule, day, {
    serviceDurationMinutes: durationMinutes,
    slotStepMinutes: getStore().business.interval_minutes || 30,
  });

  if (!isDayActive) return [];

  const busyStarts = new Set(
    getStore()
      .appointments.filter((appointment) => {
        if (appointment.staff_member_id !== staffId) return false;
        if (appointment.status === 'CANCELLED') return false;
        const schedule = new Date(appointment.schedule_time);
        if (Number.isNaN(schedule.getTime())) return false;
        const localY = schedule.getFullYear();
        const localM = String(schedule.getMonth() + 1).padStart(2, '0');
        const localD = String(schedule.getDate()).padStart(2, '0');
        return `${localY}-${localM}-${localD}` === dayPrefix;
      })
      .map((appointment) => {
        const schedule = new Date(appointment.schedule_time);
        return `${String(schedule.getHours()).padStart(2, '0')}:${String(schedule.getMinutes()).padStart(2, '0')}`;
      }),
  );

  return slotStarts
    .filter((start) => !busyStarts.has(start))
    .map((start) => {
      const [hours, minutes] = start.split(':').map(Number);
      const endTotal = hours * 60 + minutes + durationMinutes;
      const endHours = Math.floor(endTotal / 60);
      const endMinutes = endTotal % 60;
      const end = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
      // Frontend expects ISO datetimes (same shape as the real API), not bare HH:mm.
      return {
        init: toSlotIso(dayPrefix, start),
        end: toSlotIso(dayPrefix, end),
      };
    });
}

export function uploadPlaceholder(): { url: string; path: string } {
  return {
    url: DEMO_PLACEHOLDER_IMAGE,
    path: '/demo/placeholder.png',
  };
}
