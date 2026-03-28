import { Button } from '@/components/ui/button';
import { Lead } from '@/types/Lead';
import { router } from '@inertiajs/react';
import { PhoneForwardedIcon } from 'lucide-react';

export const followUpColumns: columns<Lead>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'lead.name',
        header: 'Name',
    },
    {
        accessorKey: 'lead.phone',
        header: 'Phone',
    },
    {
        accessorKey: 'remind_at',
        header: 'Remind At',
        cell: ({ row }) => {
            const remindAt = new Date(row.original.remind_at);

            const today = new Date();

            const isToday =
                remindAt.getFullYear() === today.getFullYear() &&
                remindAt.getMonth() === today.getMonth() &&
                remindAt.getDate() === today.getDate();

            return (
                <span className={isToday ? 'font-semibold text-red-600' : ''}>
                    {remindAt.toLocaleDateString()}
                </span>
            );
        },
    },
    {
        accessorKey: 'is_completed',
        header: 'Status',
        cell: ({ row }) => {
            const isCompleted = row.original.is_completed;
            return (
                <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                        isCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                    {isCompleted ? 'Completed' : 'Pending'}
                </span>
            );
        },
    },
    {
        id: 'lead.id',
        header: 'Actions',
        cell: ({ row }) => {
            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.get(
                                `/leads/call-now/${row.original.lead.id}`,
                            )
                        }
                    >
                        <PhoneForwardedIcon className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
