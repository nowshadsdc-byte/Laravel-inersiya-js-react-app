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

export default function Callcenter({ leads, sources,total ,leadReminders}: { leads?: any, sources?: any, total?: number,leadReminders?:any }) {
    const {data } = leads || {};
    const leadList = data || [];
    const leadRemindersList = leadReminders || [];
   
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Call Center Dashboard" />
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Column 1: New Leads */}
          <CallCenterOne leadList={leadList} sources={sources} total={total ?? 0} />
          {/* Column 2: Call Today */}
          <CallToday leadRemindersdata={leadRemindersList} />
        </div>
      </div>
    </AppLayout>
  )
}
