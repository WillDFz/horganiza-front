'use client';
import { useStaff } from '@/hooks/useStaff';
import { StaffMember } from '@/types/api/staff.types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import BaseModal from '@/components/ui/BaseModal';
import CreateStaffMember from '../Create';
import { useMediaQuery } from '@mui/material';
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog';
import { AddOutlined } from '@mui/icons-material';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import PageHeader from '@/components/ui/PageHeader';
import StaffTable from './StaffTable';

const StaffList = () => {
    const { getUserSession } = useAuth();
    const { getStaffMembers, deleteStaffMember, loading } = useStaff();

    const [staffMembersData, setStaffMembersData] = useState<StaffMember[]>([]);
    const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [memberToDelete, setMemberToDelete] = useState<StaffMember | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

    const hasLoadedRef = useRef<boolean>(false);
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const loadStaffMembers = useCallback(async () => {
        try {
            const userSession = await getUserSession();
            if (userSession) {
                const staffMembers = await getStaffMembers();
                setStaffMembersData(staffMembers);
                setIsInitialLoading(false);
            }
        } catch (error) {
            console.error('Erro ao carregar atendentes:', error);
            setIsInitialLoading(false);
        }
    }, [getStaffMembers, getUserSession]);

    const handleOpenDeleteDialog = (staffMember: StaffMember) => {
        setMemberToDelete(staffMember);
        setOpenDeleteDialog(true);
    };

    const handleRemoveMember = async () => {
        if (!memberToDelete) return;

        try {
            await deleteStaffMember(memberToDelete.id);
            await loadStaffMembers();
            setOpenDeleteDialog(false);
            setMemberToDelete(null);
        } catch (error) {
            console.error('Erro ao deletar atendente:', error);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (hasLoadedRef.current) return;

            try {
                const userSession = await getUserSession();
                if (userSession && isMounted) {
                    hasLoadedRef.current = true;

                    if (isMounted) {
                        await loadStaffMembers();
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar atendentes:', error);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [getUserSession, getStaffMembers, loadStaffMembers]);

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setMemberToDelete(null);
    };

    const renderStaffContent = () => {
        if (loading || isInitialLoading) {
            return <LoadingState />;
        }

        if (staffMembersData.length === 0) {
            return (
                <EmptyState
                    title="Nenhum atendente cadastrado"
                    description="Adicione atendentes para gerenciar horários e agendamentos."
                    action={
                        <Button onClick={() => setOpenCreateModal(true)}>
                            Adicionar atendente
                        </Button>
                    }
                />
            );
        }

        return (
            <StaffTable
                staffMembers={staffMembersData}
                onDelete={handleOpenDeleteDialog}
            />
        );
    };

    return (
        <div>
            <PageHeader
                title="Atendentes"
                actions={
                    <Button icon={<AddOutlined />} onClick={() => setOpenCreateModal(true)}>
                        <span className="hidden md:inline">Adicionar atendente</span>
                    </Button>
                }
            />
            <Card>{renderStaffContent()}</Card>

            <BaseModal size={isDesktop ? 'lg' : 'sm'} open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <CreateStaffMember
                    onClose={() => setOpenCreateModal(false)}
                    onSuccess={loadStaffMembers}
                />
            </BaseModal>

            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleRemoveMember}
                title="Deseja realmente remover"
                itemName={memberToDelete?.name}
            />
        </div>
    );
};

export default StaffList;
