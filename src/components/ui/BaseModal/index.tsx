'use client';
import React from 'react'
import { Modal } from '@mui/material'

interface BaseModalProps {
    open: boolean
    onClose: () => void
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'sxl' | 'mxl'
    className?: string
    children: React.ReactNode
}
const BaseModal = ({ open, onClose, size = 'md', className, children }: BaseModalProps) => {

    const modalSize = {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        xxl: 'max-w-2xl',
        sxl: 'max-w-3xl',
        mxl: 'max-w-4xl',
    };

    return (
        <Modal open={open} onClose={onClose} >
            <div className={`bg-white rounded-lg mx-auto shadow-lg p-4 ${modalSize[size]} ${className}`} data-testid="base-modal-content">
                {children}
            </div>
        </Modal>
    );
};

export default BaseModal;
