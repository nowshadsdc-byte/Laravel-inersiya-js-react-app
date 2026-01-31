
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { User, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { LeadsTable } from '@/components/leads-table';
import { Lead, LeadSource, LeadStatus } from '@/lib/data';
import { DataTable } from '@/components/DataTable/DataTable';
import { columns } from './leadColums/columns';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lead Dashboard',
        href: dashboard().url,
    },
];



export default function Index({leads ,users ,lead_statuses,leadSources ,leadStatus}: { leads: Lead[] , users: User[] , lead_statuses: LeadStatus[] , leadSources: LeadSource[] , leadStatus: LeadStatus[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Dashboard" />
            <div className='w-[100%] flex items-center justify-between'>
                
                <Button onClick={() => router.get('/leads/upload')} className='w-3/12 my-2 mx-2'>Today Task</Button>
                <Button onClick={() => router.get('/leads/call-center')} className='w-3/12 my-2 mx-2'>Call Center</Button>
                <Button onClick={() => router.get('/leads/upload')} className='w-3/12 my-2 mx-2'>Add Lead</Button>

            </div>
            <div className='m-6'>
                <h1 className='text-2xl font-bold'>Lead Dashboard</h1>                
                <LeadsTable leadsdata={leads} users={users} lead_statuses={lead_statuses} leadSources={leadSources} leadStatus={leadStatus[0]} ></LeadsTable>
            </div>
        </AppLayout>
    );
}
