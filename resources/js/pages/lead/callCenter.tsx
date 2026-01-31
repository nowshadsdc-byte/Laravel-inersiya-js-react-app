
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Lead, leads, LeadSource, LeadStatus } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lead Dashboard',
        href: dashboard().url,
    },
];



export default function Callcenter({ leads }: { leads: Lead[] }) {
    const [page, setPage] = useState(1);
    const [leadData, setLeadData] = useState<Lead[]>(leads);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Dashboard" />
            <Button
                disabled={!leads.links.find(l => l.label.includes('Next'))?.url}
                onClick={() =>
                    router.get(
                        leads.links.find(l => l.label.includes('Next')).url,
                        {},
                        { preserveState: true, replace: true }
                    )
                }
            >
                Next
            </Button>
            <div className='w-[100%] flex items-center justify-between'>
                <div className='grey-box w-[30%] h-[500px] flex flex-col'>
                    <div className="commum border-1 border-b-cyan-200 w-full m-1 h-full">
                        <div className='cart'>
                            <Button onClick={() => setPage(page + 1)}>next</Button>
                            {leadData.data.map((lead) => (
                                <div key={lead.id} className="commum  m-5 border-1 border-b-cyan-200 w-full m-1 h-full flex flex-col items-center justify-center">
                                    <p>{lead.id}</p>
                                    <h3>{lead.name}</h3>
                                    <p>{lead.email}</p>
                                    <p>{lead.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
