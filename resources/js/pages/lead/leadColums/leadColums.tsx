import { Button } from '@/components/ui/button';
import { Lead } from '@/types/lead';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

export const leadColumns: ColumnDef<Lead>[] = [
    {
        id: 'id',
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: ' Name',
    },
    {
        accessorKey: 'email',
        header: 'email Code',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'whatsapp_number',
        header: 'WhatsApp Number',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => row.original.status?.name || 'N/A',
    },
    {
        accessorKey: 'source',
        header: 'Source',
    },
    {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
            const date = new Date(row.original.created_at || '');
            return date.toLocaleDateString();
        },
    },
    {
        accessorKey: 'assigned_to',
        header: 'Assigned To',
    },
    {
        accessorKey: 'town',
        header: 'Town',
    },

    {
        id: 'actions',
        header: 'Actions',
        cell: () => {
            return (
                <div className="flex gap-2">
                    {/* View Batch */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.get(`/`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
