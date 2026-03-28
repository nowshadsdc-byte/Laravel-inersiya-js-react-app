import { CourseTable } from '@/components/course-table';
import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Batch } from '@/types/Batch';
import { Course } from '@/types/Course';
import { Head, router, usePage } from '@inertiajs/react';
import { batchColumn } from './DataTable/batchColumn';
interface courseData {
    course: Course;
    batch: Batch[];
}

export default function showCours(courseData: courseData) {
    const data = usePage().props.batches;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Course',
            href: dashboard().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Dashboard" />
            <div className="m-2">
                <Button
                    className="btn btn"
                    onClick={() => {
                        router.get('/courses/create');
                    }}
                >
                    Add New Course
                </Button>
            </div>
            <div>
                <CourseTable course={courseData.course}></CourseTable>
            </div>
            <div className="m-6">
                <h1 className="text-center text-xl">
                    Batch List of :{courseData.course.name}
                </h1>
                <DataTable
                    columns={batchColumn}
                    data={courseData.course.batch}
                ></DataTable>
            </div>
        </AppLayout>
    );
}
