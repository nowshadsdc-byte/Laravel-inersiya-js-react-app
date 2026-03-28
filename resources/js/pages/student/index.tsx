import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import { PdfButton } from '@/components/ui/pdfbtn';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Student } from '@/types/Students';
import { Head, router } from '@inertiajs/react';
import { columns } from './DataTable/collums';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: dashboard().url,
    },
];
export default function Index({ students }: { students: Student[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="flex w-[100%] items-center justify-between">
                <Button
                    onClick={() => router.get('/students/create')}
                    className="mx-6 my-6 w-3/12"
                >
                    Add New Student
                </Button>
                <PdfButton href="/student/pdf" label="Download PDF"></PdfButton>
            </div>

            <DataTable
                columns={columns}
                data={students}
                searchKey="name"
            ></DataTable>
        </AppLayout>
    );
}
