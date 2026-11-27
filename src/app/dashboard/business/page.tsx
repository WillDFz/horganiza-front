'use client';
import InfoForm from '@/components/features/business/InfoForm';
import PageHeader from '@/components/ui/PageHeader';

const BussinessPage = () => {
    return (
        <div className="mx-auto w-full max-w-6xl">
            <PageHeader
                title="Meu negócio"
                description="Gerencie identidade visual, contato e configurações de agendamento da sua página pública."
            />
            <InfoForm />
        </div>
    );
};

export default BussinessPage;
