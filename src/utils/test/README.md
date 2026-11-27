# Utilitários de Teste

Este diretório contém utilitários centralizados para facilitar a criação e manutenção de testes no projeto.

## Estrutura

- `mockFactories.ts` - Factories para criar objetos mock
- `mockHelpers.ts` - Helpers para criar mocks de hooks, serviços, etc.
- `testSetup.ts` - Setup comum para testes
- `index.ts` - Exportações centralizadas

## Uso

### Factories de Objetos Mock

Use as factories para criar objetos mock de forma consistente:

```typescript
import { createMockUserSession, createMockBusiness, createMockStaffMember } from '@/testUtils';

// Criar um usuário mock básico
const user = createMockUserSession();

// Criar um usuário mock com propriedades customizadas
const customUser = createMockUserSession({ 
  name: 'John Doe', 
  email: 'john@example.com' 
});

// Criar múltiplos staff members
const staffMembers = createMockStaffMembers(3); // Cria 3 membros
```

### Helpers de Mocks

#### Mock do useAuth

```typescript
import { createMockUseAuth } from '@/testUtils';

const mockAuth = createMockUseAuth({
  isAuthenticated: true,
  loading: false,
});

mockUseAuth.mockReturnValue(mockAuth);
```

#### Mock do useRouter

```typescript
import { createMockUseRouter } from '@/testUtils';

const mockRouter = createMockUseRouter({
  push: jest.fn(),
});

mockUseRouter.mockReturnValue(mockRouter);
```

#### Mock do BaseService

```typescript
import { createMockBaseService } from '@/testUtils';

const { mockApi, setupService } = createMockBaseService(['get', 'post', 'put', 'delete']);
const service = setupService(MyService);

// Agora você pode mockar as chamadas da API
mockApi.get.mockResolvedValue({ status: 200, data: [] });
```

### Helpers de localStorage

```typescript
import { setupLocalStorageUser, clearLocalStorage } from '@/testUtils';

// Configurar um usuário no localStorage
const user = setupLocalStorageUser(createMockUserSession());

// Limpar localStorage
clearLocalStorage();
```

## Exemplos de Uso Completo

### Exemplo 1: Teste de Hook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './index';
import { createMockUseAuth, createMockUserSession, setupLocalStorageUser } from '@/testUtils';

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupLocalStorageUser(createMockUserSession());
  });

  it('should return authenticated user', () => {
    const mockAuth = createMockUseAuth({ isAuthenticated: true });
    mockUseAuth.mockReturnValue(mockAuth);
    
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Exemplo 2: Teste de Serviço

```typescript
import { createMockBaseService, createMockBusiness } from '@/testUtils';

describe('BusinessService', () => {
  let mockApi: { get: jest.Mock; post: jest.Mock };
  let service: BusinessService;

  beforeEach(() => {
    const { mockApi: api, setupService } = createMockBaseService(['get', 'post']);
    mockApi = api as { get: jest.Mock; post: jest.Mock };
    service = setupService(BusinessService) as BusinessService;
  });

  it('should get business', async () => {
    const mockBusiness = createMockBusiness();
    mockApi.get.mockResolvedValue({ status: 200, data: [mockBusiness] });
    
    const result = await service.getBusiness('1');
    expect(result).toEqual([mockBusiness]);
  });
});
```

### Exemplo 3: Teste de Componente

```typescript
import { createMockUseAuth, createMockStaffMembers } from '@/testUtils';

describe('StaffList', () => {
  beforeEach(() => {
    const mockAuth = createMockUseAuth({ isAuthenticated: true });
    mockUseAuth.mockReturnValue(mockAuth);
    
    const mockStaff = createMockStaffMembers(2);
    mockGetStaffMembers.mockResolvedValue(mockStaff);
  });
});
```

## Benefícios

1. **Consistência**: Todos os testes usam os mesmos objetos mock
2. **Manutenibilidade**: Mudanças nos tipos são feitas em um único lugar
3. **Legibilidade**: Código de teste mais limpo e fácil de entender
4. **Produtividade**: Menos código repetido, testes mais rápidos de escrever

## Adicionando Novas Factories

Para adicionar uma nova factory:

1. Adicione a função em `mockFactories.ts`
2. Exporte em `index.ts`
3. Documente aqui no README

Exemplo:

```typescript
// mockFactories.ts
export const createMockNewType = (overrides?: Partial<NewType>): NewType => ({
  id: '1',
  name: 'Default Name',
  ...overrides,
});
```

