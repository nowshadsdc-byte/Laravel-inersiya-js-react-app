import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './DataTable/columns';
import { Course } from '@/types/Course';
import { Button } from '@/components/ui/button';

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
            <Button onClick={()=>router.get('/courses/create')} className='w-3/12 my-6 mx-6'>Add New Course</Button>
            <DataTable
                    columns={columns}
                    data={courses}
                    searchKey="name"
                  />
        </AppLayout>
    );
}
