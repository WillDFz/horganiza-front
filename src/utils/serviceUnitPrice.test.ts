import type { Service } from '@/types/api/services.types';

import { serviceUnitPrice } from './serviceUnitPrice';

const baseService = (overrides: Partial<Service>): Service => ({
  id: '1',
  name: 'S',
  price: 100,
  business_id: 'b',
  duration: 30,
  has_staff: true,
  parent_id: '',
  created_at: '',
  updated_at: '',
  ...overrides,
});

describe('serviceUnitPrice', () => {
  it('uses promotional price when finite', () => {
    expect(serviceUnitPrice(baseService({ price: 100, promotional_price: 50 }))).toBe(50);
  });

  it('ignores non-finite promo', () => {
    expect(serviceUnitPrice(baseService({ price: 100, promotional_price: Number.NaN }))).toBe(100);
  });

  it('uses price when promo undefined', () => {
    expect(serviceUnitPrice(baseService({ price: 77 }))).toBe(77);
  });
});
