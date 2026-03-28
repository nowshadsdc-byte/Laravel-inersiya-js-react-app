import { Head } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { Lead } from "@/lib/data";
import { dashboard } from '@/routes';
import { BreadcrumbItem } from "@/types";
import CallNows from '@/components/callNows';
import Notes from '@/components/Notes';
import CallsList from '@/components/CallsList';
import RemindersList from '@/components/RemindersList';
import { CallDailoag } from '@/components/call-dailoag';
import { CallList } from '@/components/call-list';
import { CallRemindersDialog } from '@/components/call-reminders-dailoag';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Call Now Log',
        href: dashboard().url,
    }, {
        title: 'Lead Details',
        href: '#',
    }

];

export default function CallNow({ lead ,statuses, sources, users,town}: { lead: Lead, statuses: any[], sources: any[], users: any[], town: any }) {
    const [edit, setEdit] = useState(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs} backButton={true}>
            <Head title="Call Now Log" />
            <div className='flex w-full tems-start justify-start gap-4 p-4 border rounded-lg bg-white shadow-sm'>

                <div className='w-full border-1 p-4 rounded-lg bg-gray-50'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1>Lead Information</h1>
                        <Button onClick={() => setEdit(prev => !prev)}>
                            {edit ? "Cancel" : "Edit"}
                        </Button>
                    </div>
                    <CallNows data={lead} isEdit={edit} statuses={statuses} sources={sources} users={users} town={town} />
                    
                </div>
                <div className='w-full border-1 p-4 rounded-lg bg-gray-50'>
                    <div className='flex items-center justify-between mb-4 '>
                        <h1>Notes</h1>
                        <CallDailoag ButtonLabel="Add Note" leadID={lead.id} />
                    </div>
                    <Notes notes={lead.notes} />
                </div>
                <div className='w-full border-1 p-4 rounded-lg bg-gray-50'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1>Call List</h1>
                        <CallList ButtonLabel="Add Call Log" leadID={lead.id} />
                    </div>
                    <CallsList calls={lead.calls} />
                </div>
                <div className='w-full border-1 p-4 rounded-lg bg-gray-50'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1>Reminders</h1>
                        <CallRemindersDialog ButtonLabel="Add New Reminder" leadID={lead.id} />
                    </div>
                    <RemindersList reminders={lead.reminders} leadId={lead.id} />
                </div>
            </div>
        </AppLayout>
    );
}