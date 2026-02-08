import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CallCenterOne } from '@/components/callCenterOne'
import CallToday from '@/components/CallToday'
import { LeadViewDialog } from '@/components/LeadViewDialog'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Call Center',
    href: dashboard().url,
  },
  
]

const mockLeads = [
  { id: 1, name: 'Rahim Ahmed', phone: '017xxxxxxx' },
  { id: 2, name: 'Karim Khan', phone: '018xxxxxxx' },
  { id: 3, name: 'Sadia Islam', phone: '019xxxxxxx' },
]

export default function Callcenter({ leads, sources,total ,reminders}: { leads?: any, sources?: any, total?: number,reminders?:any }) {
    const {data } = leads || {};
    const leadList = data || [];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Call Center Dashboard" />
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Column 1: New Leads */}
          <CallCenterOne leadList={leadList} sources={sources} total={total ?? 0} />
          {/* Column 2: Call Today */}
          <CallToday leadsdata={leadList} />
        </div>
      </div>
    </AppLayout>
  )
}
