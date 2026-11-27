import { BaseService } from '../base.service';
import { UploadService } from './upload.service';

jest.mock('../base.service');

describe('UploadService', () => {
  let service: UploadService;
  let mockPost: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    (BaseService as unknown as jest.Mock).mockImplementation(function (this: UploadService) {
      Object.defineProperty(this, 'api', {
        value: { post: mockPost },
        writable: true,
        configurable: true,
      });
    });
    service = new UploadService();
  });

  it('returns url on success', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    mockPost.mockResolvedValue({ status: 200, data: { url: 'https://cdn/x.png', path: '/x' } });

    const url = await service.uploadFile(file);

    expect(mockPost).toHaveBeenCalledWith('/upload', expect.any(FormData));
    expect(url).toBe('https://cdn/x.png');
  });

  it('throws when status not ok', async () => {
    const file = new File(['x'], 'a.png');
    mockPost.mockResolvedValue({ status: 500, data: { url: 'x' } });

    await expect(service.uploadFile(file)).rejects.toThrow('Failed to upload file');
  });

  it('throws when url missing', async () => {
    const file = new File(['x'], 'a.png');
    mockPost.mockResolvedValue({ status: 200, data: { path: '/p' } });

    await expect(service.uploadFile(file)).rejects.toThrow('Invalid upload response');
  });
});
