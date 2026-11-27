import React from 'react';
import { StaffMember } from '@/types/api/staff.types';
import { formatPhoneBR } from '@/utils/formatters/phoneBr';

interface StaffInfoProps {
    staffMember: StaffMember;
}

const StaffInfo = ({ staffMember }: StaffInfoProps) => {
    return (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <h1 className="text-xl font-bold text-gray-900">{staffMember?.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{staffMember?.role}</p>
            <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
                {staffMember?.email && <p>{staffMember?.email}</p>}
                {staffMember?.phone && <p>{formatPhoneBR(staffMember?.phone)}</p>}
            </div>
        </div>
    );
};

export default StaffInfo;
