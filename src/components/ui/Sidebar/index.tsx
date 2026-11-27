'use client';
import { Close } from '@mui/icons-material';
import { useSidebar } from '@/hooks/useSidebar';
import { SidebarItem as SidebarItemType } from '@/types/components/sidebar.types';
import SidebarItem from './Item';
import { useMediaQuery } from '@mui/material';
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { navItems } = useSidebar();

    const isDesktop = useMediaQuery('(min-width: 1024px)');

    const getSidebarClassName = () => {
        const baseClasses = 'fixed left-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out';
        if (isDesktop) {
            return `${baseClasses} top-[80px] h-[calc(100vh-80px)] translate-x-0`;
        }
        const translateClass = isOpen ? 'translate-x-0' : '-translate-x-full';
        return `${baseClasses} top-0 h-full z-50 ${translateClass}`;
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && !isDesktop && (
                <div
                    className='fixed inset-0 bg-black/50 z-40 transition-opacity'
                    onClick={onClose}
                    aria-hidden='true'
                    data-testid="sidebar-overlay"
                />
            )}

            <aside className={getSidebarClassName()}>
                {!isDesktop && (
                    <div className='flex items-center justify-between px-4 py-2'>
                        <button
                            onClick={onClose}
                            className='p-1 hover:bg-gray-100 rounded transition-colors'
                            aria-label='Fechar menu'
                            data-testid="sidebar-close-button"
                        >
                            <Close />
                        </button>
                    </div>
                )}
                <nav className='p-4'>
                    <ul className='space-y-2'>
                        {navItems.map((item: SidebarItemType) => (
                            <li key={item.href}>
                                <SidebarItem label={item.label} href={item.href} icon={item.icon} />
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;

