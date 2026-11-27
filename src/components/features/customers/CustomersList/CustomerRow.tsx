'use client';

import { Customer } from '@/types/api/customer.types';
import Badge from '@/components/ui/Badge';

interface CustomerRowProps {
    customer: Customer;
}

function formatCreatedAt(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '—';
    }
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

const CustomerRow = ({ customer }: CustomerRowProps) => {
    return (
        <tr className="hover:bg-surface-muted">
            <td className="whitespace-nowrap px-4 py-4">
                <div className="text-sm font-medium text-foreground">{customer.email}</div>
                <div className="mt-1 text-xs text-muted-foreground sm:hidden">
                    {customer.confirmed_email ? 'E-mail confirmado' : 'E-mail pendente'}
                </div>
            </td>
            <td className="hidden whitespace-nowrap px-4 py-4 sm:table-cell">
                <Badge variant={customer.confirmed_email ? 'success' : 'neutral'}>
                    {customer.confirmed_email ? 'Confirmado' : 'Pendente'}
                </Badge>
            </td>
            <td className="hidden whitespace-nowrap px-4 py-4 text-sm text-foreground md:table-cell">
                {formatCreatedAt(customer.created_at)}
            </td>
        </tr>
    );
};

export default CustomerRow;
