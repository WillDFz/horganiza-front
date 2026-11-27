import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Appointment, AppointmentStatus } from '@/types/api/appointments.types';
import type { Business } from '@/types/api/business.types';
import type { CreateService, UpdateService } from '@/types/api/services.types';
import type { CreateStaffMember, StaffMember, Weekday } from '@/types/api/staff.types';
import {
  CUSTOMER_SESSION_ID,
  DEMO_CONFIRMATION_CODE,
  DEMO_CUSTOMER_EMAIL,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEMO_SESSION_COOKIE,
} from './constants';
import { seedCustomerSession, seedLoginResponse, seedOwnerSession } from './seed';
import {
  createAppointment,
  createService,
  createStaff,
  deleteAppointment,
  deleteService,
  deleteStaff,
  getAppointmentById,
  getAvailableSlots,
  getBusiness,
  getBusinessBySlug,
  getStaffById,
  getStaffSchedule,
  listAppointments,
  listAppointmentsByStaff,
  listCustomers,
  listServices,
  listStaff,
  updateAppointmentStatus,
  updateBusiness,
  updateService,
  updateStaff,
  updateWeekday,
  uploadPlaceholder,
} from './store';

function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

function error(message: string, status: number): NextResponse {
  return json({ message }, status);
}

async function readBody<T>(request: NextRequest): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

async function isBusinessAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(DEMO_SESSION_COOKIE)?.value === 'business';
}

async function isCustomerAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(DEMO_SESSION_COOKIE)?.value === 'customer';
}

async function setSession(kind: 'business' | 'customer'): Promise<void> {
  const jar = await cookies();
  jar.set(DEMO_SESSION_COOKIE, kind, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
}

async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(DEMO_SESSION_COOKIE);
}

function pathOf(segments: string[] | undefined): string {
  return (segments ?? []).join('/');
}

export async function handleMockApi(
  request: NextRequest,
  segments: string[] | undefined,
): Promise<NextResponse> {
  const method = request.method.toUpperCase();
  const path = pathOf(segments);
  const { searchParams } = request.nextUrl;

  // --- Auth ---
  if (path === 'auth/login' && method === 'POST') {
    const body = await readBody<{ email?: string; password?: string }>(request);
    if (body?.email !== DEMO_EMAIL || body?.password !== DEMO_PASSWORD) {
      return error('Credenciais inválidas', 401);
    }
    await setSession('business');
    return json(seedLoginResponse);
  }

  if (path === 'auth/logout' && method === 'POST') {
    await clearSession();
    return json({ success: true });
  }

  if (path === 'auth/me' && method === 'GET') {
    if (!(await isBusinessAuthenticated())) {
      return error('Não autenticado', 401);
    }
    return json({ user: seedOwnerSession });
  }

  if (path === 'auth/me-customer' && method === 'GET') {
    if (!(await isCustomerAuthenticated())) {
      return error('Não autenticado', 401);
    }
    return json({ customer: seedCustomerSession });
  }

  if (path === 'auth/register' && method === 'POST') {
    return error('Cadastro desabilitado no modo demo', 400);
  }

  if (path === 'auth/register/customer' && method === 'POST') {
    const body = await readBody<{ email?: string; business_id?: string }>(request);
    return json(
      {
        email: body?.email ?? 'novo@demo.app',
        business_id: body?.business_id ?? getBusiness().business_id,
      },
      201,
    );
  }

  if (path === 'auth/login/customer' && method === 'POST') {
    await setSession('customer');
    return json(true);
  }

  if (path === 'auth/request-code' && method === 'POST') {
    return json({ success: true, demo_code: DEMO_CONFIRMATION_CODE });
  }

  if (path === 'auth/verify-code' && method === 'POST') {
    const body = await readBody<{ confirmation_code?: string; email?: string }>(request);
    if (body?.confirmation_code && body.confirmation_code !== DEMO_CONFIRMATION_CODE) {
      return error('Código de confirmação inválido', 401);
    }
    await setSession('customer');
    return json({ success: true });
  }

  if (path === 'email_confirmations' && method === 'POST') {
    const body = await readBody<{ id?: string }>(request);
    return json({ id: body?.id ?? CUSTOMER_SESSION_ID }, 201);
  }

  // --- Business ---
  if (path === 'business' && method === 'GET') {
    return json({ business: getBusiness() });
  }

  if (path.startsWith('business/') && method === 'GET') {
    const slug = path.slice('business/'.length);
    const business = getBusinessBySlug(slug);
    if (!business) {
      return error('Negócio não encontrado', 404);
    }
    return json({ business });
  }

  if (path === 'business' && method === 'PUT') {
    const body = await readBody<Business>(request);
    if (!body) return error('Payload inválido', 400);
    return json({ business: updateBusiness(body) });
  }

  // --- Staff ---
  if ((path === 'staff/members' || path === 'staff/members/') && method === 'GET') {
    return json({ staffMembers: listStaff() });
  }

  if (path === 'staff' && method === 'POST') {
    const body = await readBody<CreateStaffMember>(request);
    if (!body) return error('Payload inválido', 400);
    return json(createStaff(body), 201);
  }

  if (path === 'staff/schedule' && method === 'PUT') {
    const body = await readBody<Weekday>(request);
    if (!body) return error('Payload inválido', 400);
    return json(updateWeekday(body));
  }

  const staffScheduleMatch = /^staff\/([^/]+)\/schedule$/.exec(path);
  if (staffScheduleMatch && method === 'GET') {
    return json({ staffMemberWeekDaySchedule: getStaffSchedule(staffScheduleMatch[1]) });
  }

  const staffIdMatch = /^staff\/([^/]+)$/.exec(path);
  if (staffIdMatch) {
    const staffId = staffIdMatch[1];
    if (method === 'GET') {
      const member = getStaffById(staffId);
      if (!member) return error('Atendente não encontrado', 404);
      return json({ staffMember: member });
    }
    if (method === 'PUT') {
      const body = await readBody<StaffMember>(request);
      if (!body) return error('Payload inválido', 400);
      try {
        return json(updateStaff({ ...body, id: staffId }));
      } catch {
        return error('Atendente não encontrado', 404);
      }
    }
    if (method === 'DELETE') {
      deleteStaff(staffId);
      return json({ success: true });
    }
  }

  // --- Services ---
  if (path === 'service/list' && method === 'GET') {
    return json({ services: listServices(searchParams.get('q') ?? undefined) });
  }

  if (path === 'service' && method === 'POST') {
    const body = await readBody<CreateService>(request);
    if (!body) return error('Payload inválido', 400);
    return json({ service: createService(body) }, 201);
  }

  const serviceIdMatch = /^service\/([^/]+)$/.exec(path);
  if (serviceIdMatch) {
    const serviceId = serviceIdMatch[1];
    if (method === 'PUT') {
      const body = await readBody<UpdateService>(request);
      if (!body) return error('Payload inválido', 400);
      try {
        return json({ service: updateService({ ...body, id: serviceId }) });
      } catch {
        return error('Serviço não encontrado', 404);
      }
    }
    if (method === 'DELETE') {
      deleteService(serviceId);
      return json({ success: true });
    }
  }

  // --- Customers ---
  if (path === 'customer/list' && method === 'GET') {
    return json({ customers: listCustomers() });
  }

  // --- Appointments ---
  if (path === 'appointment/staff/schedule' && method === 'GET') {
    const staff = searchParams.get('staff') ?? '';
    const date = searchParams.get('date') ?? '';
    const duration = Number(searchParams.get('duration') ?? '30');
    return json(getAvailableSlots(staff, date, Number.isFinite(duration) ? duration : 30));
  }

  if (path === 'appointment/staff' && method === 'GET') {
    const staff = searchParams.get('staff') ?? '';
    const businessId = searchParams.get('business_id') ?? '';
    return json(listAppointmentsByStaff(staff, businessId));
  }

  if (path === 'appointment' && method === 'GET') {
    return json(listAppointments(searchParams.get('business_id') ?? undefined));
  }

  if (path === 'appointment' && method === 'POST') {
    const body = await readBody<Appointment>(request);
    if (!body) return error('Payload inválido', 400);
    return json(createAppointment(body), 201);
  }

  const appointmentIdMatch = /^appointment\/([^/]+)$/.exec(path);
  if (appointmentIdMatch) {
    const appointmentId = appointmentIdMatch[1];
    if (method === 'PATCH') {
      const body = await readBody<{ status?: AppointmentStatus }>(request);
      if (!body?.status) return error('Payload inválido', 400);
      try {
        return json(updateAppointmentStatus(appointmentId, body.status));
      } catch {
        return error('Agendamento não encontrado', 404);
      }
    }
    if (method === 'DELETE') {
      deleteAppointment(appointmentId);
      return json({ success: true });
    }
  }

  const appointmentsPluralMatch = /^appointments\/([^/]+)$/.exec(path);
  if (appointmentsPluralMatch && method === 'GET') {
    const appointment = getAppointmentById(appointmentsPluralMatch[1]);
    if (!appointment) return error('Agendamento não encontrado', 404);
    return json(appointment);
  }

  // --- Upload ---
  if (path === 'upload' && method === 'POST') {
    return json(uploadPlaceholder(), 201);
  }

  return error(`Mock route not found: ${method} /${path}`, 404);
}
