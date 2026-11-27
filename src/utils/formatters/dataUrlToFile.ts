/**
 * Converts a data URL (e.g. from readAsDataURL) to a File for multipart upload.
 */
export function dataUrlToFile(dataUrl: string, filename: string): File {
    const commaIndex = dataUrl.indexOf(',');
    if (commaIndex === -1) {
        throw new Error('Invalid data URL');
    }
    const header = dataUrl.slice(0, commaIndex);
    const base64 = dataUrl.slice(commaIndex + 1);
    const mimeMatch = /^data:([^;,]+)/.exec(header);
    const mime = mimeMatch?.[1] ?? 'application/octet-stream';
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new File([bytes], filename, { type: mime });
}
