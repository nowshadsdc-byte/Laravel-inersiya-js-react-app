import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns } from './DataTable/columns';
import { Course } from '@/types/Course';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: dashboard().url,
    },
];
export default function Index({ courses }: { courses: Course[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Dashboard" />  
            <DataTable
                    columns={columns}
                    data={courses}
                    searchKey="name"
                  />

        </AppLayout>
    );
}
