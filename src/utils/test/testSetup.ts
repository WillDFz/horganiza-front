/**
 * Setup comum para testes
 * Use este arquivo para configurações globais de teste
 */

/**
 * Configura localStorage mockado para testes
 */
export const setupLocalStorageMock = () => {
    const storage: Record<string, string> = {};

    return {
        getItem: jest.fn((key: string) => storage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            storage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
            delete storage[key];
        }),
        clear: jest.fn(() => {
            Object.keys(storage).forEach((key) => delete storage[key]);
        }),
    };
};

/**
 * Limpa todos os mocks e localStorage antes de cada teste
 */
export const setupBeforeEach = () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();

        // Configura localStorage mockado se necessário
        if (typeof window !== 'undefined') {
            Object.defineProperty(window, 'localStorage', {
                value: setupLocalStorageMock(),
                writable: true,
            });
        }
    });
};

/**
 * Helper para aguardar que uma condição seja verdadeira
 */
export const waitForCondition = async (
    condition: () => boolean,
    timeout = 5000,
    interval = 100
): Promise<void> => {
    const startTime = Date.now();

    while (!condition()) {
        if (Date.now() - startTime > timeout) {
            throw new Error(`Condition not met within ${timeout}ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
};

