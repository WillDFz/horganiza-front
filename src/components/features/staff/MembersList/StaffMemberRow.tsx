'use client';
import { StaffMember } from '@/types/api/staff.types';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

interface StaffMemberRowProps {
    staffMember: StaffMember;
    onDelete: (staffMember: StaffMember) => void;
}

const StaffMemberRow = ({ staffMember, onDelete }: StaffMemberRowProps) => {
    return (
        <tr className="hover:bg-surface-muted">
            <td className="whitespace-nowrap px-4 py-4">
                <div className="text-sm font-medium text-foreground">{staffMember.name}</div>
                <div className="text-sm text-muted-foreground md:hidden">{staffMember.email}</div>
                <div className="text-sm text-muted-foreground sm:hidden">{staffMember.phone}</div>
            </td>
            <td className="hidden whitespace-nowrap px-4 py-4 md:table-cell">
                <div className="text-sm text-foreground">{staffMember.email}</div>
            </td>
            <td className="hidden whitespace-nowrap px-4 py-4 sm:table-cell">
                <div className="text-sm text-foreground">{staffMember.phone}</div>
            </td>
            <td className="hidden whitespace-nowrap px-4 py-4 lg:table-cell">
                <Badge variant="info">{staffMember.role}</Badge>
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/staff/${staffMember.id}`} className="rounded px-2 py-1 text-primary hover:text-primary-600">
                        Editar
                    </Link>
                    <button
                        className="rounded px-2 py-1 text-primary-dark hover:text-primary-400"
                        onClick={() => onDelete(staffMember)}
                    >
                        Excluir
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default StaffMemberRow;
