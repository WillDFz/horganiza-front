'use client';
import { useState, useRef, useEffect } from 'react';
import { TextField } from '@mui/material';
import { SketchPicker, ColorResult } from 'react-color';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const ColorPicker = ({
    label,
    value,
    onChange,
    placeholder = '#000000'
}: ColorPickerProps) => {
    
    const [showPicker, setShowPicker] = useState<boolean>(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleColorChange = (color: ColorResult) => {
        onChange(color.hex);
    };

    const handleHexInputChange = (inputValue: string) => {
        if (/^#[0-9A-Fa-f]{0,6}$/.test(inputValue)) {
            onChange(inputValue);
        }
    };

    return (
        <div className="relative" ref={pickerRef}>
            <label className="mb-1 block text-sm font-medium text-foreground">
                {label}
            </label>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowPicker(!showPicker)}
                    className="h-10 w-12 cursor-pointer rounded border-2 border-border shadow-sm transition-colors hover:border-muted-foreground"
                    style={{ backgroundColor: value || '#ffffff' }}
                    aria-label={`Selecionar ${label.toLowerCase()}`}
                    data-testid="color-picker-button"
                />
                <TextField
                    label="Código Hexadecimal"
                    value={value}
                    onChange={(e) => handleHexInputChange(e.target.value)}
                    placeholder={placeholder}
                    fullWidth
                    variant="outlined"
                    size="small"
                    slotProps={{
                        htmlInput: {
                            maxLength: 7,
                            pattern: '^#[0-9A-Fa-f]{6}$',
                        },
                    }}
                />
            </div>
            {showPicker && (
                <div className="absolute z-10 mt-2" data-testid="color-picker-popup">
                    <SketchPicker
                        color={value || '#000000'}
                        onChangeComplete={handleColorChange}
                    />
                </div>
            )}
        </div>
    );
};

export default ColorPicker;

