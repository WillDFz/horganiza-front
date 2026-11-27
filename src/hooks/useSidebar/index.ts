import { SidebarItem } from '@/types/components/sidebar.types';

export const useSidebar = () => {

    const navItems: SidebarItem[] = [
        {
            label: 'Painel',
            href: '/dashboard',
            icon: 'dashboardOutlined'
        },
        {   
            label: 'Meu Negócio',
            href: '/dashboard/business',
            icon: 'businessOutlined'
        },
        {
            label: 'Agendamentos',
            href: '/dashboard/appointments',
            icon: 'eventOutlined'
        },
        {
            label: 'Serviços',
            href: '/dashboard/services',
            icon: 'servicesOutlined'
        },
        {
            label: 'Atendentes',
            href: '/dashboard/staff',
            icon: 'personOutlined'
        },
        {
            label: 'Clientes',
            href: '/dashboard/customers',
            icon: 'personAddOutlined'
        },
        {
            label: 'Configurações',
            href: '/dashboard/settings',
            icon: 'settingsOutlined'
        }
    ]


    return { navItems }
}