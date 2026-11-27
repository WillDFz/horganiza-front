'use client';



import { CircularProgress, TextField } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomer';
import { CustomerLoginCredentials } from '@/types/api/auth.types';
import { toast } from 'react-toastify';
import ConfirmationCode from '../../ConfirmationCode';
import { useAuth } from '@/contexts/auth-context';
import CustomerAuthCard from '../CustomerAuthCard';
import CustomerAuthFormShell from '../CustomerAuthFormShell';
import { useCustomerBusinessInfo } from '../useCustomerBusinessInfo';


interface CustomerLoginFormProps {

    business_slug: string;

}

const CustomerLoginForm: React.FC<CustomerLoginFormProps> = ({ business_slug }) => {

    const { loading: customerFlowLoading, requestConfirmationCode, verifyCode } = useCustomer();
    const { customerLogin, loading: authLoading } = useAuth();
    const { businessInfo, loading, error } = useCustomerBusinessInfo(business_slug);
    const router = useRouter();
    const isSubmitting = customerFlowLoading || authLoading;

    const [customerData, setCustomerData] = useState<CustomerLoginCredentials>({
        email: '',
        url: business_slug,
        confirmation_code: '',
    });

    const [isCodeStep, setIsCodeStep] = useState<boolean>(false);

    const handleRequestCode = useCallback(async () => {

        if (!customerData.url) {
            toast.error('Negócio inválido para solicitar código');
            return;
        }

        const ok = await requestConfirmationCode(customerData.email, customerData.url);



        if (ok) {

            toast.success("Código de confirmação enviado para o e-mail");

            setIsCodeStep(true);

        }

    }, [customerData.url, customerData.email, requestConfirmationCode]);



    const handleBackToEmailStep = useCallback(() => {

        setIsCodeStep(false);

        setCustomerData((prev) => ({ ...prev, confirmation_code: '' }));

    }, []);



    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!customerData.url) {
            toast.error('Negócio inválido para login');
            return;
        }

        const ok = await verifyCode(customerData);

        if (ok) {

            await customerLogin(customerData);

            router.push(`/business/${business_slug}`);

        }

    }, [business_slug, customerData, verifyCode, customerLogin, router]);



    const renderFormFields = () => {

        if (!isCodeStep) {

            return (

                <>

                    <div>

                        <TextField
                            value={customerData.email}
                            onChange={(e) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                            label="Email"
                            type="email"
                            name="email"
                            id="email"
                            variant="outlined"
                            size='small'
                            fullWidth
                            required
                            autoComplete="email"

                        />

                    </div>

                    <button className='flex justify-center items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors gap-2' type="button" disabled={isSubmitting} onClick={handleRequestCode}>

                        <span>Enviar código de confirmação</span>

                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}

                    </button>

                </>

            );

        }



        return (

            <>

                <TextField

                    value={customerData.email}

                    label="Email"

                    type="email"

                    name="email-readonly"

                    id="email-readonly"

                    variant="outlined"

                    size='small'

                    fullWidth

                    disabled

                />

                <ConfirmationCode

                    confirmationCode={customerData.confirmation_code}

                    setConfirmationCode={(confirmationCode) => setCustomerData((prev) => ({ ...prev, confirmation_code: confirmationCode }))}

                    disabled={isSubmitting}

                />

                <button className='flex justify-center items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors gap-2' type="submit" disabled={isSubmitting}>

                    <span>Entrar</span>

                    {isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}

                </button>

                <button className='flex justify-center items-center border border-primary text-primary px-4 py-2 rounded-md hover:bg-primary-50 transition-colors gap-2' type="button" disabled={isSubmitting} onClick={handleBackToEmailStep}>

                    <span>Alterar e-mail</span>

                </button>

            </>

        );

    };



    return (

        <CustomerAuthCard>

            <CustomerAuthFormShell

                loading={loading}

                error={error}

                businessInfo={businessInfo}

                onSubmit={handleSubmit}

                footerLink={{

                    href: `/business/${business_slug}/auth/register`,

                    label: 'Não tem uma conta? Cadastre-se',

                }}

            >

                {renderFormFields()}

            </CustomerAuthFormShell>

        </CustomerAuthCard>

    );

};



export default CustomerLoginForm;

