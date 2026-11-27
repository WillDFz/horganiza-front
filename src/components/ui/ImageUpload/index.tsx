'use client';
import { useRef } from 'react';
import Button from '@/components/ui/Button';

interface ImageUploadProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    maxSizeMB?: number;
    accept?: string;
    previewHeight?: string;
}

const ImageUpload = ({
    label = 'Upload de Imagem',
    value,
    onChange,
    required = false,
    maxSizeMB = 5,
    accept = 'image/*',
    previewHeight = 'max-h-32',
}: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione um arquivo de imagem válido.');
                return;
            }

            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                alert(`A imagem deve ter no máximo ${maxSizeMB}MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                onChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleChangeClick = () => {
        fileInputRef.current?.click();
    };

    const preview = value || '';

    return (
        <div>
            {label ? (
                <label className="mb-2 block text-sm font-medium text-foreground">
                    {label}
                    {required ? <span className="ml-1 text-error">*</span> : null}
                </label>
            ) : null}
            {preview ? (
                <div className="relative">
                    <div className="rounded-lg border-2 border-border bg-surface-muted p-4">
                        <div className="flex flex-col items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={preview}
                                alt="Preview da imagem"
                                className={`${previewHeight} max-w-full rounded object-contain`}
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleChangeClick}
                                    data-testid="image-upload-change-button"
                                >
                                    Alterar imagem
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleRemove}
                                    data-testid="image-upload-remove-button"
                                >
                                    Remover
                                </Button>
                            </div>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                        data-testid="image-upload-input"
                    />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleChangeClick}
                    className="w-full cursor-pointer rounded-lg border-2 border-dashed border-border bg-surface p-8 text-center transition-colors hover:border-primary hover:bg-primary-50/40"
                >
                    <div className="flex flex-col items-center gap-2">
                        <svg
                            className="h-12 w-12 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <div>
                            <p className="text-sm text-foreground">
                                Clique para fazer upload ou arraste uma imagem aqui
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                PNG, JPG, GIF até {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                        required={required}
                        data-testid="image-upload-input"
                    />
                </button>
            )}
        </div>
    );
};

export default ImageUpload;
