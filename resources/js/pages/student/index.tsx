import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: dashboard().url,
    },
];
export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />  
            <h1>Student Dashboard</h1>
        </AppLayout>
    );
}
