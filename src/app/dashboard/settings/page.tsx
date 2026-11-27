import React from 'react';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/ui/PageHeader';

const SettingsPage = () => {
    return (
        <div>
            <PageHeader title="Configurações" />
            <Card padding="lg">
                <EmptyState
                    title="Em breve"
                    description="Preferências da conta e do negócio estarão disponíveis nesta página."
                />
            </Card>
        </div>
    );
};

export default SettingsPage;
