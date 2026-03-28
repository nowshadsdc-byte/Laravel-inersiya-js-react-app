import { Button } from '@/components/ui/button';
import { Lead } from '@/types/Lead';
import { Trash2 } from 'lucide-react';

export const columns: columns<Lead>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'name Name',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({}) => {
            return (
                <div className="flex gap-2">
                    {/* Student Profile */}

                    <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
