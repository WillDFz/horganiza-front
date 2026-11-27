'use client';
import CustomerRegisterForm from '@/components/auth/Customer/Register';
import { useParams } from 'next/navigation';

const CustomerRegisterPage = () => {
    const { slug } = useParams();
    
    return (
        <div className="w-full min-h-screen bg-linear-to-br from-primary-100 via-primary-300 to-secondary-200 flex justify-center items-center py-8 px-4 relative overflow-hidden">
            <CustomerRegisterForm business_slug={slug as string} />
        </div>
    )
};

export default CustomerRegisterPage;