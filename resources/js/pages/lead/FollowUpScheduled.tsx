import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { followUpColumns } from './leadColums/folloupcolums';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function FollowUpScheduled({ leads }: { leads: any[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Follow-Up Scheduled" />
            <DataTable
                columns={followUpColumns}
                data={leads}
                searchKey="name"
            ></DataTable>
        </AppLayout>
    );
}
