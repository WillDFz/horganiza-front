'use client';
import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';

import { useService } from '@/hooks/useService';
import BaseModal from '@/components/ui/BaseModal';
import CreateService from '../Create';
import ServiceCard from './ServiceCard';
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog';
import { Service } from '@/types/api/services.types';
import Search from '@/components/ui/Search';
import { Add } from '@mui/icons-material';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import PageHeader from '@/components/ui/PageHeader';

const ServicesList = () => {
    const { getServices, deleteService, services, loading } = useService();

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const [openCreateServiceModal, setOpenCreateServiceModal] = useState<boolean>(false);
    const [openEditServiceModal, setOpenEditServiceModal] = useState<boolean>(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const [query, setQuery] = useState<string>('');

    const handleOpenCreateServiceModal = () => {
        setOpenCreateServiceModal(true);
    };

    const handleOpenEditServiceModal = (service: Service) => {
        setServiceToEdit(service);
        setOpenEditServiceModal(true);
    };

    const handleCloseEditServiceModal = () => {
        setOpenEditServiceModal(false);
        setServiceToEdit(null);
    };

    const handleOpenDeleteDialog = (service: Service) => {
        setServiceToDelete(service);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setServiceToDelete(null);
    };

    const handleDeleteService = async () => {
        if (!serviceToDelete) return;
        try {
            await deleteService(serviceToDelete.id);
            handleCloseDeleteDialog();
        } catch (error) {
            console.error('Erro ao deletar serviço:', error);
        }
    };

    const handleServiceSuccess = useCallback(async () => {
        await getServices(query);
    }, [getServices, query]);

    useEffect(() => {
        handleServiceSuccess();
    }, [handleServiceSuccess]);

    const renderServicesContent = () => {
        if (loading) {
            return <LoadingState />;
        }

        if (services.length === 0) {
            return (
                <EmptyState
                    title="Nenhum serviço cadastrado"
                    description="Cadastre serviços para que clientes possam agendar."
                    action={
                        <Button onClick={handleOpenCreateServiceModal}>
                            Adicionar serviço
                        </Button>
                    }
                />
            );
        }

        return (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onDelete={handleOpenDeleteDialog}
                        onEdit={handleOpenEditServiceModal}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <PageHeader
                title="Serviços"
                actions={
                    <Button icon={<Add />} onClick={handleOpenCreateServiceModal}>
                        <span className="hidden md:inline">Adicionar serviço</span>
                    </Button>
                }
            />
            <div className="mb-4 flex flex-row justify-between gap-4">
                <Search query={query} setQuery={setQuery} />
            </div>

            {renderServicesContent()}

            <BaseModal size={isDesktop ? 'md' : 'sm'} className="mt-30" open={openCreateServiceModal} onClose={() => setOpenCreateServiceModal(false)}>
                <CreateService
                    onClose={() => setOpenCreateServiceModal(false)}
                    onSuccess={handleServiceSuccess}
                />
            </BaseModal>

            <BaseModal size={isDesktop ? 'md' : 'sm'} className="mt-30" open={openEditServiceModal} onClose={handleCloseEditServiceModal}>
                <CreateService
                    serviceToEdit={serviceToEdit}
                    onClose={handleCloseEditServiceModal}
                    onSuccess={handleServiceSuccess}
                />
            </BaseModal>

            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteService}
                title="Deseja realmente remover o serviço"
                itemName={serviceToDelete?.name}
            />
        </div>
    );
};

export default ServicesList;
