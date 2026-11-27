import { renderHook, act } from '@testing-library/react';
import { useCustomer } from './index';
import AuthService from '@/services/auth/auth.service';
import { toast } from 'react-toastify';

jest.mock('@/services/auth/auth.service');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

describe('useCustomer', () => {
  let verifyCode: jest.Mock;
  let requestConfirmationCode: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    verifyCode = jest.fn();
    requestConfirmationCode = jest.fn();
    (AuthService as jest.Mock).mockImplementation(() => ({
      verifyCode,
      requestConfirmationCode,
    }));
  });

  const creds = { email: 'a@b.com', url: 'x', confirmation_code: '123456' };

  it('verifyCode returns service result', async () => {
    verifyCode.mockResolvedValue(true);
    const { result } = renderHook(() => useCustomer());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.verifyCode(creds);
    });

    expect(ok).toBe(true);
    expect(verifyCode).toHaveBeenCalledWith(creds);
  });

  it('verifyCode on error shows toast and returns false', async () => {
    verifyCode.mockRejectedValue(new Error('bad'));
    const { result } = renderHook(() => useCustomer());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.verifyCode(creds);
    });

    expect(ok).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('bad');
  });

  it('requestConfirmationCode handles non-Error rejection', async () => {
    requestConfirmationCode.mockRejectedValue('x');
    const { result } = renderHook(() => useCustomer());

    let ok: boolean | undefined;
    await act(async () => {
      ok = await result.current.requestConfirmationCode('e@e.com', 'slug');
    });

    expect(ok).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Erro ao solicitar código de confirmação');
  });
});
