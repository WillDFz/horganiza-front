import { renderHook } from '@testing-library/react';
import { useSidebar } from './index';

describe('useSidebar', () => {
  it('should return navItems with correct structure', () => {
    const { result } = renderHook(() => useSidebar());

    expect(result.current.navItems).toBeDefined();
    expect(Array.isArray(result.current.navItems)).toBe(true);
    expect(result.current.navItems.length).toBeGreaterThan(0);

    result.current.navItems.forEach((item) => {
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('href');
      expect(item).toHaveProperty('icon');
      expect(typeof item.label).toBe('string');
      expect(typeof item.href).toBe('string');
      expect(typeof item.icon).toBe('string');
    });
  });

  it('should include all expected navigation items', () => {
    const { result } = renderHook(() => useSidebar());

    const expectedItems = [
      { label: 'Painel', href: '/dashboard' },
      { label: 'Meu Negócio', href: '/dashboard/business' },
      { label: 'Agendamentos', href: '/dashboard/appointments' },
      { label: 'Serviços', href: '/dashboard/services' },
      { label: 'Atendentes', href: '/dashboard/staff' },
      { label: 'Clientes', href: '/dashboard/customers' },
      { label: 'Configurações', href: '/dashboard/settings' },
    ];

    expectedItems.forEach((expectedItem) => {
      const found = result.current.navItems.find(
        (item) => item.label === expectedItem.label && item.href === expectedItem.href
      );
      expect(found).toBeDefined();
    });
  });
});

