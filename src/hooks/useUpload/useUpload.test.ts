import { renderHook, act } from '@testing-library/react';
import { useUpload } from './index';
import { UploadService } from '@/services/upload/upload.service';
import { toast } from 'react-toastify';

jest.mock('@/services/upload/upload.service');
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe('useUpload', () => {
  let mockUploadFile: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUploadFile = jest.fn();
    (UploadService as jest.Mock).mockImplementation(() => ({
      uploadFile: mockUploadFile,
    }));
  });

  it('uploadFile returns url and toasts success', async () => {
    mockUploadFile.mockResolvedValue('https://cdn/a.png');
    const { result } = renderHook(() => useUpload());
    const file = new File(['x'], 'a.png');

    let url: string | undefined;
    await act(async () => {
      url = await result.current.uploadFile(file);
    });

    expect(url).toBe('https://cdn/a.png');
    expect(toast.success).toHaveBeenCalled();
  });

  it('uploadFile toasts error and rethrows', async () => {
    mockUploadFile.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useUpload());

    await act(async () => {
      await expect(result.current.uploadFile(new File([''], 'b.png'))).rejects.toThrow('fail');
    });
    expect(toast.error).toHaveBeenCalled();
  });
});
