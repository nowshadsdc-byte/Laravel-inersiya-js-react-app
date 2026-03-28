import { BatchTable } from '@/components/batch-table';
import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Batch } from '@/types/Batch';
import { Student } from '@/types/Students';
import { Head, router, usePage } from '@inertiajs/react';
import { studentCollum } from './DataTabe/studentCollum';
interface BatchData {
    batch: Batch;
    students: Student[];
}

export default function Index(batchData: BatchData) {
    const data = usePage().props.batches;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Batches',
            href: dashboard().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Dashboard" />
            <div className="px-6">
                <Button
                    className="btn btn"
                    onClick={() => {
                        router.get('/batch/create');
                    }}
                >
                    Add New Batch
                </Button>
            </div>
            <BatchTable batch={batchData.batch}></BatchTable>
            <div className="m-6">
                <DataTable
                    columns={studentCollum}
                    data={batchData.batch.students}
                ></DataTable>
            </div>
        </AppLayout>
    );
}
