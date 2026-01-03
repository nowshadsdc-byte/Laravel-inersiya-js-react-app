import RenderAny from '@/components/RenderAny';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students Profile',
        href: dashboard().url,
    },
];
interface PageProps {
    [key: string]: unknown;
}
export default function Index(studentData :PageProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Profile" />
            <div className="p-6 bg-white rounded shadow">
                <RenderAny data={studentData as unknown as any} />
            </div>
        </AppLayout>
    );
}
