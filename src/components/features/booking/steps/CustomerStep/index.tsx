'use client';

import { InputAdornment, TextField } from '@mui/material';

import { BOOKING_COLUMN_HEADING } from '../../constants';
import { formatPhoneBR, stripPhoneDigits } from '@/utils/formatters/phoneBr';

import type { CustomerStepProps } from '@/types/booking';

export function CustomerStep({
    accentColor,
    firstName,
    lastName,
    phoneDigits,
    onFirstNameChange,
    onLastNameChange,
    onPhoneDigitsChange,
    submitting,
    onBack,
}: Readonly<CustomerStepProps>) {
    const phoneOk = phoneDigits.replace(/\D/g, '').length >= 10;

    return (
        <>
            <h3 className={BOOKING_COLUMN_HEADING}>Informações do cliente</h3>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                    label="Primeiro nome"
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    label="Último nome"
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                    required
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                />
            </div>
            <div className="mt-4">
                <TextField
                    label="Telefone"
                    value={formatPhoneBR(phoneDigits)}
                    onChange={(e) => onPhoneDigitsChange(stripPhoneDigits(e.target.value))}
                    placeholder="(11) 96123-4567"
                    fullWidth
                    slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <span className="text-sm text-custom-black-600">+55</span>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </div>
            <div className="mt-auto flex justify-between gap-4 pt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm font-medium text-custom-black-600 hover:text-custom-black-200"
                >
                    ← De volta
                </button>
                <button
                    type="submit"
                    disabled={submitting || !firstName.trim() || !lastName.trim() || !phoneOk}
                    className="rounded px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                >
                    {submitting ? 'Enviando…' : 'Confirmar agendamento'}
                </button>
            </div>
        </>
    );
}
