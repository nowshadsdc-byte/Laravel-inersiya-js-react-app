import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import { Head, router, usePage } from '@inertiajs/react';
import { BatchTable } from '@/components/batch-table';
import { Batch } from '@/types/Batch';
import { Student } from '@/types/Students';
import { studentCollum } from './DataTabe/studentCollum';
import { columns } from '../student/DataTable/collums';
interface BatchData {
    batch: Batch,
    students: Student[]
}

export default function Index(batchData: BatchData) {
    const data = usePage().props.batches;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Batches',
            href: dashboard().url,
        },
    ];
    console.log(batchData.batch)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Dashboard" />
            <div className="px-6">
                <Button className="btn btn" onClick={() => {
                    router.get('/batch/create')
                }}>Add New Batch</Button>
            </div>
            <BatchTable batch={batchData.batch}></BatchTable>
            <div className='m-6'>
                <DataTable columns={studentCollum} data={batchData.batch.students}></DataTable>
            </div>

        </AppLayout>
    );
}
