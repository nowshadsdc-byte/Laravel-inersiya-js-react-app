import { ChartAreaInteractive } from '@/components/ChartAreaInteractive';
import DashboardCard from '@/components/DashboardCard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { GraduationCap, LibraryBig, Blend } from 'lucide-react';

interface DashboardProps {
    totalStudent: number;
    totalBatchs: number;
    totalCourses: number;
    totalLeads: number;
    activeCalls: number;
    conversionRate: number;
    followUpsToday: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
export default function Dashboard({ totalStudent, totalBatchs, totalCourses, totalLeads , activeCalls, conversionRate, followUpsToday }: DashboardProps) {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className='flex'>
                <DashboardCard title='Total Students' value={totalStudent} icon={<GraduationCap className="h-4 w-4" />}></DashboardCard>
                <DashboardCard title='Total Courses' value={totalCourses} icon={<Blend className="h-4 w-4" />}></DashboardCard>
                <DashboardCard title='Total Batchs' value={totalBatchs} icon={<LibraryBig className="h-4 w-4" />}></DashboardCard>

            </div>
            <div className='m-6'>
                <h2 className='text-lg font-medium mb-4'>Leads</h2>
                <div className='flex'>
                    <DashboardCard title='Total Leads' value={totalLeads} icon={<GraduationCap className="h-4 w-4" />}></DashboardCard>
                    <DashboardCard title='Active Calls' value={activeCalls} icon={<GraduationCap className="h-4 w-4" />}></DashboardCard>
                    <DashboardCard title='Conversion Rate' value={conversionRate} icon={<GraduationCap className="h-4 w-4" />}></DashboardCard>
                    <DashboardCard title='Follow-ups Today' value={followUpsToday} icon={<GraduationCap className="h-4 w-4" />}></DashboardCard>
                </div>
            </div>
          

        </AppLayout>
    );
}
