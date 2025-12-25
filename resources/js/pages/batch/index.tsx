import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Button } from "@/components/ui/button";
import { Head, router, usePage } from '@inertiajs/react';
import { columns } from './DataTabe/collum';
import { Batch } from '@/types/Batch';


export default function Index({ batches }: { batches: Batch[] }) {
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
        <Button className="btn btn" onClick={() => {
          router.get('/batch/create')
        }}>Add New Batch</Button>
      </div>
      <div className="p-6">
        <DataTable
          columns={columns}
          data={batches}
          searchKey="name"
        />
      </div>
    </AppLayout>
  );
}
