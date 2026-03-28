import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Role, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { rolescolum } from './colums/rolescolum';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users Permissions',
        href: dashboard().url,
    },
];
export default function index({ roles }: { roles: Role[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Permissions" />
            <div className="m-6 flex items-center justify-between">
                <Button onClick={() => router.get('/role/create')}>
                    Create Role
                </Button>
            </div>
            <div className="m-6">
                <DataTable columns={rolescolum} data={roles}></DataTable>
            </div>
        </AppLayout>
    );
}
