import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImageUpload from './index';

// Mock FileReader
global.FileReader = class FileReader extends EventTarget {
    result: string | null = null;
    onloadend: ((this: FileReader, ev: ProgressEvent<FileReader>) => void) | null = null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readAsDataURL(_file: Blob) {
        setTimeout(() => {
            this.result = 'data:image/png;base64,test';
            if (this.onloadend) {
                this.onloadend({} as ProgressEvent<FileReader>);
            }
        }, 0);
    }
} as unknown as typeof FileReader;

describe('ImageUpload', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.alert = jest.fn();
    });

    it('should render image upload component with label', () => {
        render(<ImageUpload value="" onChange={mockOnChange} label="Upload Image" />);

        expect(screen.getByText(/upload image/i)).toBeInTheDocument();
    });

    it('should show upload area when no image is provided', () => {
        render(<ImageUpload value="" onChange={mockOnChange} />);

        expect(screen.getByText(/clique para fazer upload/i)).toBeInTheDocument();
    });

    it('should show preview when image is provided', () => {
        render(<ImageUpload value="data:image/png;base64,test" onChange={mockOnChange} />);

        const image = screen.getByAltText(/preview da imagem/i);
        expect(image).toBeInTheDocument();
    });

    it('should call onChange when file is selected', async () => {
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        render(<ImageUpload value="" onChange={mockOnChange} />);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
            Object.defineProperty(input, 'files', {
                value: [file],
                writable: false,
            });

            fireEvent.change(input);

            await waitFor(() => {
                expect(mockOnChange).toHaveBeenCalled();
            });
        }
    });

    it('should show error for non-image files', () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        render(<ImageUpload value="" onChange={mockOnChange} />);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
            Object.defineProperty(input, 'files', {
                value: [file],
                writable: false,
            });

            fireEvent.change(input);

            expect(global.alert).toHaveBeenCalledWith('Por favor, selecione um arquivo de imagem válido.');
        }
    });

    it('should show error for files exceeding max size', () => {
        const file = new File(['x'.repeat(10 * 1024 * 1024)], 'test.png', { type: 'image/png' });
        render(<ImageUpload value="" onChange={mockOnChange} maxSizeMB={5} />);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) {
            Object.defineProperty(input, 'files', {
                value: [file],
                writable: false,
            });

            fireEvent.change(input);

            expect(global.alert).toHaveBeenCalledWith('A imagem deve ter no máximo 5MB.');
        }
    });

    it('should call onChange with empty string when remove button is clicked', () => {
        render(<ImageUpload value="data:image/png;base64,test" onChange={mockOnChange} />);

        const removeButton = screen.getByText(/remover/i);
        fireEvent.click(removeButton);

        expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('should show required indicator when required is true', () => {
        render(<ImageUpload value="" onChange={mockOnChange} required={true} label="Image" />);

        const requiredIndicator = screen.getByText('*');
        expect(requiredIndicator).toBeInTheDocument();
    });
});

