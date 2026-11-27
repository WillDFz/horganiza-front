import { useAuth } from '@/contexts/auth-context';
import { useStaff } from '@/hooks/useStaff';
import { useRouter } from 'next/navigation';
import { createMockUserSession } from './mockFactories';

/**
 * Cria um mock completo do hook useAuth
 */
export const createMockUseAuth = (overrides?: Partial<ReturnType<typeof useAuth>>) => {
  const defaultMock = {
    user: null,
    isAuthenticated: false,
    sessionChecking: false,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    customerLogin: jest.fn(),
    customerRegister: jest.fn(),
    logout: jest.fn(),
    refreshBusinessSession: jest.fn(),
    refreshCustomerSession: jest.fn(),
    getUserSession: jest.fn().mockResolvedValue(null),
    ...overrides,
  };

  return defaultMock;
};

/**
 * Cria um mock completo do hook useStaff
 */
export const createMockUseStaff = (overrides?: Partial<ReturnType<typeof useStaff>>) => ({
  createStaffMember: jest.fn(),
  getStaffMembers: jest.fn(),
  getStaffMemberById: jest.fn(),
  updateStaffMember: jest.fn(),
  deleteStaffMember: jest.fn(),
  getWeekdays: jest.fn(),
  updateWeekday: jest.fn(),
  getAvailableAppointmentRange: jest.fn(),
  staffMembers: [],
  staffMember: null,
  loading: false,
  ...overrides,
});

/**
 * Cria um mock do useRouter do Next.js
 */
export const createMockUseRouter = (overrides?: Partial<ReturnType<typeof useRouter>>) => {
  const defaultMock = {
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    ...overrides,
  };

  return defaultMock;
};

/**
 * Cria um mock do toast do react-toastify
 */
export const createMockToast = () => ({
  error: jest.fn(),
  success: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
});

/**
 * Cria um mock do BaseService com API mockada
 */
export const createMockBaseService = (methods: string[] = ['get', 'post', 'put', 'delete']) => {
  const mockApi: Record<string, jest.Mock> = {};

  methods.forEach((method) => {
    mockApi[method] = jest.fn();
  });

  return {
    mockApi,
    setupService: <T>(ServiceClass: new () => T) => {
      (ServiceClass as unknown as jest.Mock).mockImplementation(function (this: T) {
        Object.defineProperty(this, 'api', {
          value: mockApi,
          writable: true,
          configurable: true,
        });
      });
      return new ServiceClass();
    },
  };
};

/**
 * Helper para configurar localStorage com um usuário
 */
export const setupLocalStorageUser = (user = createMockUserSession()) => {
  localStorage.setItem('cold-agenda-user', JSON.stringify(user));
  return user;
};

/**
 * Helper para limpar localStorage
 */
export const clearLocalStorage = () => {
  localStorage.clear();
};

/**
 * Helper para mockar o módulo react-toastify
 */
export const mockReactToastify = () => {
  jest.mock('react-toastify', () => ({
    toast: createMockToast(),
  }));
};

/**
 * Helper para mockar o módulo next/navigation
 */
export const mockNextNavigation = (routerOverrides?: Partial<ReturnType<typeof useRouter>>) => {
  const mockRouter = createMockUseRouter(routerOverrides);
  
  jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => mockRouter),
    redirect: jest.fn(),
    usePathname: jest.fn(() => '/'),
    useSearchParams: jest.fn(() => new URLSearchParams()),
  }));

  return mockRouter;
};

