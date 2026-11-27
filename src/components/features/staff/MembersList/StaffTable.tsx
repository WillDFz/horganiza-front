'use client';
import { StaffMember } from '@/types/api/staff.types';
import StaffMemberRow from './StaffMemberRow';

interface StaffTableProps {
    staffMembers: StaffMember[];
    onDelete: (staffMember: StaffMember) => void;
}

const StaffTable = ({ staffMembers, onDelete }: StaffTableProps) => {
    return (
        <div className='overflow-x-auto -mx-4 md:mx-0'>
            <div className='inline-block min-w-full align-middle px-4 md:px-0'>
                <table className='min-w-full divide-y divide-border'>
                    <thead className='bg-surface-muted'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>Nome</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell'>Email</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell'>Telefone</th>
                            <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell'>Função</th>
                            <th className='px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider'>Ações</th>
                        </tr>
                    </thead>
                    <tbody className='bg-surface divide-y divide-border'>
                        {staffMembers.map((staffMember) => (
                            <StaffMemberRow
                                key={staffMember.id}
                                staffMember={staffMember}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffTable;
