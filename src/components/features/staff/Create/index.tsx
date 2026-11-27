import React, { useState } from 'react'
import { CreateStaffMember as CreateStaffMemberType } from '@/types/api/staff.types';
import { useAuth } from '@/contexts/auth-context';
import { InputAdornment, IconButton, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useStaff } from '@/hooks/useStaff';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { formatPhoneBR, stripPhoneDigits } from '@/utils/formatters/phoneBr';
import Button from '@/components/ui/Button';
interface CreateStaffMemberProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const roles = [
    { label: 'Gerente', value: 'MANAGER' },
    { label: 'Atendente', value: 'STAFF' },
]

const CreateStaffMember = ({ onClose, onSuccess }: CreateStaffMemberProps) => {

    const { user } = useAuth();
    const { createStaffMember, loading } = useStaff();

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [staffMemberData, setStaffMemberData] = useState<CreateStaffMemberType>({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        business_id: user?.business_id || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStaffMemberData({ ...staffMemberData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await createStaffMember(staffMemberData);
            if (data) {
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div>
            <h1 className='text-2xl font-bold text-center mb-4'>Adicionar Atendente</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

                <div className='grid grid-cols-2 gap-4'>

                    <TextField
                        label="Nome"
                        name="name"
                        value={staffMemberData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        size="small" />

                    <TextField
                        label="Email"
                        name="email"
                        value={staffMemberData.email}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small" />

                </div>
                <TextField
                    label="Telefone"
                    name="phone"
                    value={formatPhoneBR(staffMemberData.phone)}
                    onChange={(e) => setStaffMemberData({ ...staffMemberData, phone: stripPhoneDigits(e.target.value) })}
                    required
                    fullWidth
                    variant="outlined"
                    size="small"
                    slotProps={{ htmlInput: { inputMode: 'numeric', autoComplete: 'tel-national' } }}
                    placeholder="(11) 98765-4321"
                />

                <FormControl fullWidth>
                    <InputLabel id="role-label">Cargo</InputLabel>
                    <Select
                        label="Cargo"
                        name="role"
                        value={staffMemberData.role}
                        onChange={(e) => setStaffMemberData({ ...staffMemberData, role: e.target.value })}
                        fullWidth
                        variant="outlined"
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Senha"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={staffMemberData.password}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }} />

                <Button type="submit" loading={loading} className="mx-auto w-full max-w-xs">
                    Adicionar Atendente
                </Button>
            </form>
        </div>
    )
}

export default CreateStaffMember
