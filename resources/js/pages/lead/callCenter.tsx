import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CallCenterOne } from '@/components/callCenterOne'

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

export default function Callcenter({ leads, sources,total }: { leads?: any, sources?: any, total?: number }) {
    const {data } = leads || {};
    const leadList = data || [];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Call Center Dashboard" />
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {/* Column 1: New Leads */}
            <CallCenterOne leadList={leadList} sources={sources} paginateData={leads} total={total} />
          {/* Column 2: Call Today */}
          <Card className="h-[75vh] flex flex-col">
            <CardHeader>
              <CardTitle>Call Today</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto space-y-3">
              {mockLeads.map(lead => (
                <div
                  key={lead.id}
                  className="rounded-lg border p-3"
                >
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Follow-up scheduled today
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Call</Button>
                    <Button size="sm" variant="outline">Done</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Column 3: Search / Manual Call */}
          <Card className="h-[75vh] flex flex-col">
            <CardHeader>
              <CardTitle>Search Leads</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input placeholder="Search by name or phone..." />

              <div className="space-y-3 overflow-y-auto">
                {mockLeads.map(lead => (
                  <div
                    key={lead.id}
                    className="rounded-lg border p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
