'use client';

import { CircularProgress, TextField } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation';
import { CustomerRegisterInfo } from '@/types/api/auth.types';
import { useAuth } from '@/contexts/auth-context';
import CustomerAuthCard from '../CustomerAuthCard';
import CustomerAuthFormShell from '../CustomerAuthFormShell';
import { useCustomerBusinessInfo } from '../useCustomerBusinessInfo';

interface CustomerRegisterFormProps {
    business_slug: string;
}

const CustomerRegisterForm: React.FC<CustomerRegisterFormProps> = ({ business_slug }) => {
    const { customerRegister, loading: loadingCustomer } = useAuth();
    const { businessInfo, loading, error } = useCustomerBusinessInfo(business_slug);
    const router = useRouter();

    const [email, setEmail] = useState('');

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!businessInfo?.id) {
            return;
        }

        const payload: CustomerRegisterInfo = {
            email,
            business_id: businessInfo.id,
        };

        try {
            const response = await customerRegister(payload);
            if (response) {
                router.push(`/business/${business_slug}/auth/login`);
            }
        } catch {
            throw new Error('Erro ao cadastrar cliente');
        }
    }, [email, businessInfo, business_slug, customerRegister, router]);

    return (
        <CustomerAuthCard>
            <CustomerAuthFormShell
                loading={loading}
                error={error}
                businessInfo={businessInfo}
                onSubmit={handleSubmit}
                footerLink={{
                    href: `/business/${business_slug}/auth/login`,
                    label: 'Já tem uma conta? Entre',
                }}
            >
                <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    autoComplete="email"
                />
                <button
                    className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-600"
                    type="submit"
                    disabled={loadingCustomer}
                >
                    <span>Cadastrar</span>
                    {loadingCustomer ? <CircularProgress size={20} /> : null}
                </button>
            </CustomerAuthFormShell>
        </CustomerAuthCard>
    );
};

export default CustomerRegisterForm;
