import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Course } from '@/types/Course';
import { Head, router } from '@inertiajs/react';
import { columns } from './DataTable/columns';

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
            <Button
                onClick={() => router.get('/courses/create')}
                className="mx-6 my-6 w-3/12"
            >
                Add New Course
            </Button>
            <div className="m-6">
                <DataTable
                    columns={columns}
                    data={courses}
                    searchKey="lead.name"
                />
            </div>
        </AppLayout>
    );
}
