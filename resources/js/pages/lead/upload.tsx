
import BulkComponent from '@/components/bulkComponent';
import AddLead from '@/components/leadAdd';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Dashboard',
        href: dashboard().url,
    },
];
export default function upload() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Lead" />
            <div className='m-6'>
                <h1 className='text-2xl font-bold'>Add New Lead</h1>
                <div className="mt-8 flex w-full gap-1" >
                    <div className="w-full max-w-md p-4 border rounded-lg">
                       <AddLead />
                    </div>
                    <div className="w-full max-w-md p-4 border rounded-lg">
                        <h2 className="text-lg font-medium m-4">Upload a CSV file to import leads in bulk.</h2>
                        <BulkComponent />
                    </div>
                    
                </div>
            </div>
        </AppLayout>
    );
}
