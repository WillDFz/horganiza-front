import RootLayout from './layout';

describe('RootLayout', () => {
  it('exporta o layout raiz como componente', () => {
    expect(typeof RootLayout).toBe('function');
  });
});
