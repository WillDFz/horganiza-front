import React from 'react'
import { TextField } from '@mui/material'

interface ConfirmationCodeProps {
    confirmationCode: string;
    setConfirmationCode: (code: string) => void;
    disabled?: boolean;
}

const ConfirmationCode = ({ confirmationCode, setConfirmationCode, disabled = false }: ConfirmationCodeProps) => {
    return (
        <div>
            <TextField
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                label="Código de confirmação"
                type="text"
                name="confirmationCode"
                id="confirmationCode"
                variant="outlined"
                size='small'
                fullWidth
                required
                autoComplete="one-time-code"
                disabled={disabled}
            />
        </div>
    )
}

export default ConfirmationCode
