'use client';
import { Dialog } from '@mui/material';
import Button from '@/components/ui/Button';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    itemName?: string;
}

const DeleteConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    itemName,
}: DeleteConfirmationDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='xs'
            fullWidth
            data-testid="remove-dialog"
        >
            <div className='p-5'>
                <h2 className='mb-5 text-xl font-bold text-foreground'>
                    {title}{itemName ? ` ${itemName}` : ''}?
                </h2>
                <div className='flex justify-end gap-2'>
                    <Button variant="secondary" onClick={onClose} data-testid="cancel-remove">
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} data-testid="confirm-remove">
                        Excluir
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
