import BulkComponent from '@/components/bulkComponent';
import AddLead from '@/components/leadAdd';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { LeadSource, LeadStatus, User } from '@/types/Lead';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Dashboard',
        href: dashboard().url,
    },
];
export default function upload({
    leadSources,
    leadStatuses,
    assignedTos,
    townNames,
    lead_interests,
}: {
    leadSources: LeadSource;
    leadStatuses: LeadStatus;
    assignedTos: User;
    townNames: Array<string>;
    lead_interests: Array<string>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Lead" />
            <div className="m-6 w-full">
                <h1 className="text-2xl font-bold">Add New Lead</h1>

                <div className="mt-8 flex w-full gap-4">
                    <div className="w-1/2 rounded-lg border p-4">
                        <AddLead
                            leadSources={leadSources}
                            leadStatuses={leadStatuses}
                            assignedTos={assignedTos}
                            townNames={townNames}
                            interests={lead_interests}
                        />
                    </div>

                    <div className="w-1/2 rounded-lg border p-4">
                        <h2 className="mb-4 text-lg font-medium">
                            Upload a CSV file to import leads in bulk.
                        </h2>
                        <BulkComponent />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
