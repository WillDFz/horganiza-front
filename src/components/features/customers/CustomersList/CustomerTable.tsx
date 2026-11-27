'use client';

import { Customer } from '@/types/api/customer.types';
import CustomerRow from './CustomerRow';

interface CustomerTableProps {
    customers: Customer[];
}

const CustomerTable = ({ customers }: CustomerTableProps) => {
    return (
        <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-surface-muted">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                E-mail
                            </th>
                            <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                                Status
                            </th>
                            <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                                Cadastro
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-surface">
                        {customers.map((customer) => (
                            <CustomerRow key={customer.id} customer={customer} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;
