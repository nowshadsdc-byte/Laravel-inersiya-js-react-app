import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: any
}

export function LeadViewDialog({ open, onOpenChange, lead }: Props) {
  if (!lead) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Lead #{lead.id} - {lead.phone}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
           <TabsTrigger value="CallNow">Call Now</TabsTrigger>
          </TabsList>

          {/* ---------------- DETAILS TAB ---------------- */}
          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input value={lead.name} readOnly />
              <Input value={lead.email} readOnly />
              <Input value={lead.phone} readOnly />
              <Input value={lead.whatsapp_number} readOnly />
              <Input value={lead.town} readOnly />
              <Input value={lead.address} readOnly />
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{lead.status?.name}</Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Source</p>
                <Badge variant="secondary">{lead.source?.name}</Badge>
              </div>
            </div>

            {lead.profile && (
              <div>
                <h4 className="font-semibold mb-2">Profile</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={lead.profile.occupation}
                    readOnly
                    placeholder="Occupation"
                  />
                  <Input
                    value={lead.profile.company}
                    readOnly
                    placeholder="Company"
                  />
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              <p>Created: {new Date(lead.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(lead.updated_at).toLocaleString()}</p>
            </div>
          </TabsContent>

          {/* ---------------- NOTES TAB ---------------- */}

          <TabsContent value="notes" className="mt-4 space-y-3">
            <Textarea>

            </Textarea>
            {lead.notes?.length ? (
              lead.notes.map((note: any) => (
                <Textarea
                  key={note.id}
                  value={note.note}
                  readOnly
                />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No notes added yet.
              </p>
            )}
          </TabsContent>

          {/* ---------------- CALLS TAB ---------------- */}
          <TabsContent value="calls" className="mt-4">
            {lead.calls?.length ? (
              <div>Call list goes here</div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No call history found.
              </p>
            )}
          </TabsContent>

          {/* ---------------- REMINDERS TAB ---------------- */}
          <TabsContent value="reminders" className="mt-4">
            {lead.reminders?.length ? (
              <div>Reminder list goes here</div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No reminders scheduled.
              </p>
            )}
          </TabsContent>
          <TabsContent value="CallNow" className="mt-4">
            <p>Lorem ipsum dolor sit.</p>

          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}