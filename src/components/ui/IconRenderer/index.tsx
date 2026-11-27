import {
    DashboardOutlined,
    BusinessOutlined,
    EventOutlined,
    BuildOutlined,
    PersonOutlined,
    PersonAddOutlined,
    SettingsOutlined,
    DevicesOutlined,
    Home,
} from '@mui/icons-material';
import React from 'react';
import { resolveIconColor } from '@/styles/tokens';

interface IconRendererProps {
    icon: string;
    color: string;
    size: string;
}

const IconRenderer: React.FC<IconRendererProps> = ({ icon, color, size }) => {
    const iconStyle = {
        color: resolveIconColor(color),
        fontSize: size,
    };

    switch (icon) {
        case 'homeOutlined':
            return <Home sx={iconStyle} />;
        case 'dashboardOutlined':
            return <DashboardOutlined sx={iconStyle} />;
        case 'businessOutlined':
            return <BusinessOutlined sx={iconStyle} />;
        case 'eventOutlined':
            return <EventOutlined sx={iconStyle} />;
        case 'servicesOutlined':
            return <BuildOutlined sx={iconStyle} />;
        case 'devicesOutlined':
            return <DevicesOutlined sx={iconStyle} />;
        case 'personOutlined':
            return <PersonOutlined sx={iconStyle} />;
        case 'personAddOutlined':
            return <PersonAddOutlined sx={iconStyle} />;
        case 'settingsOutlined':
            return <SettingsOutlined sx={iconStyle} />;
        default:
            return null;
    }
};

export default IconRenderer;
