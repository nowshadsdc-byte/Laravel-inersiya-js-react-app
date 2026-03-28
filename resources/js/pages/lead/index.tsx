import { LeadsTable } from '@/components/leads-table';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Lead, LeadSource, LeadStatus } from '@/lib/data';
import { dashboard } from '@/routes';
import { User, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lead Dashboard',
        href: dashboard().url,
    },
];

export default function Index({
    leads,
    users,
    lead_statuses,
    leadSources,
    leadStatus,
}: {
    leads: Lead[];
    users: User[];
    lead_statuses: LeadStatus[];
    leadSources: LeadSource[];
    leadStatus: LeadStatus[];
    
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Dashboard" />
            <div className="flex w-[100%] items-center justify-between">
                <Button
                    onClick={() => router.get('/')}
                    className="mx-2 my-2 w-3/12"
                >
                    Activities
                </Button>
                {/* <Button
                    onClick={() => router.get('/leads/call-center')}
                    className="mx-2 my-2 w-3/12"
                >
                    Follow-up Scheduled
                </Button> */}
                <Button onClick={()=>router.get('/lead/FollowUp')}>
                    Follow Up Lead
                </Button>
                <Button
                    onClick={() => router.get('/leads/upload')}
                    className="mx-2 my-2 w-3/12"
                >
                    Add Lead
                </Button>
            </div>
            <div className="m-6">
                <h1 className="text-2xl font-bold">Lead Dashboard</h1>
                <LeadsTable
                    leadsdata={leads}
                    users={users}
                    lead_statuses={lead_statuses}
                    leadSources={leadSources}
                    leadStatus={leadStatus[0]}
                   
                ></LeadsTable>
            </div>
        </AppLayout>
    );
}
