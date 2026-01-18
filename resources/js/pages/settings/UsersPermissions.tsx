import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users Permissions',
        href: dashboard().url,
    },
];
export default function UsersPermissions() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Permissions" />
           
        </AppLayout>
    );
}
