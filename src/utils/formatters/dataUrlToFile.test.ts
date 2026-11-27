import { dataUrlToFile } from './dataUrlToFile';

describe('dataUrlToFile', () => {
  it('creates File with decoded bytes and mime from header', () => {
    const file = dataUrlToFile('data:image/png;base64,QQ==', 'x.png');
    expect(file.name).toBe('x.png');
    expect(file.type).toBe('image/png');
    expect(file.size).toBe(1);
  });

  it('uses octet-stream when mime missing', () => {
    const file = dataUrlToFile('data:;base64,QQ==', 'b.bin');
    expect(file.type).toBe('application/octet-stream');
  });

  it('throws when not a data URL', () => {
    expect(() => dataUrlToFile('not-data', 'a.txt')).toThrow('Invalid data URL');
  });
});
