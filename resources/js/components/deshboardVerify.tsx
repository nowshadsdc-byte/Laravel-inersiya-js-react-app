import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Dashboard',
        href: dashboard().url,
    },
];
export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Dashboard" />
            <div className="m-6">
                <h1 className="text-2xl font-bold">Billing Dashboard</h1>
                <p className="mt-4">
                    Welcome to the Billing Dashboard. Here you can manage your
                    billing information, view invoices, and update payment
                    methods.
                </p>
            </div>
        </AppLayout>
    );
}
