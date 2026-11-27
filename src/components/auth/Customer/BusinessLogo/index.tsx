'use client';

import { BusinessOutlined } from '@mui/icons-material';
import React from 'react';

interface BusinessLogoProps {
    logo?: string;
}

const BusinessLogo: React.FC<BusinessLogoProps> = ({ logo }) => {
    if (logo) {
        return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logo} alt="Logo" className="w-40 object-contain" />
        );
    }

    return (
        <div
            className="flex h-24 w-40 items-center justify-center rounded-lg bg-gray-100"
            aria-label="Logo indisponível"
        >
            <BusinessOutlined className="text-gray-400" sx={{ fontSize: 48 }} />
        </div>
    );
};

export default BusinessLogo;
