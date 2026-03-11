import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { useForm } from "@inertiajs/react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    lead: any
}

export function CallNow({ open, onOpenChange, lead }: Props) {

    interface FormData {
        lead_id: string | number
        called_at: string
        outcome: string
        call_note: string
        call_status: "New" | "Contacted" | "Qualified" | "Lost" | "Converted"
    }

    const { data, setData, post, processing, reset, errors } = useForm<FormData>({
        lead_id: lead?.id ?? "",
        called_at: "",
        outcome: "answered",
        call_note: "",
        call_status: "Contacted",
    })

    if (!lead) return null

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        post(`/leads/call-center/${lead.id}`, {
            onSuccess: () => {
                reset()
                onOpenChange(false)
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl">
                <DialogHeader>
                    <DialogTitle>
                        Call Lead — {lead.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-8">

                    {/* LEFT SIDE — LEAD INFO */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm">

                        <h3 className="text-base font-semibold mb-4">Lead Information</h3>

                        <p><strong>Name:</strong> {lead.name}</p>
                        <p><strong>Phone:</strong> {lead.phone}</p>
                        <p><strong>Whatsapp:</strong> {lead.whatsapp_number}</p>
                        <p><strong>City:</strong> {lead.town}</p>
                        <p><strong>Interest:</strong> {lead.profile?.interest}</p>
                        <p><strong>Source:</strong> {lead.source?.name}</p>
                        {/* <p><strong>Status:</strong> {lead.status}</p> */}
                        {/* <p><strong>Assigned To:</strong> {lead.assignedTo}</p>
                        <p><strong>Address:</strong> {lead.address}</p>
                        <p><strong>Company:</strong> {lead.company}</p>
                        <p><strong>Notes:</strong> {lead.notes}</p> */}
                    </div>
                    {/* RIGHT SIDE — CALL FORM */}
                    <div className="bg-white border rounded-xl p-6">
                        <h3 className="text-base font-semibold mb-6">Log Call</h3>
                        <form onSubmit={submit} className="space-y-5">
                            {/* Call Time */}
                            <div>
                                <Label>Call Time</Label>
                                <input
                                    type="datetime-local"
                                    className="w-full border rounded-md p-2 mt-1"
                                    value={data.called_at}
                                    onChange={(e) => setData("called_at", e.target.value)}
                                    required
                                />
                            </div>
                            {/* Call Outcome */}
                            <div>
                                <Label>Call Outcome</Label>
                                <select
                                    className="w-full border rounded-md p-2 mt-1"
                                    value={data.outcome}
                                    onChange={(e) => setData("outcome", e.target.value)}
                                >
                                    <option value="answered">Answered</option>
                                    <option value="missed">Missed</option>
                                    <option value="busy">Busy</option>
                                    <option value="not_reachable">Not Reachable</option>
                                </select>
                            </div>

                            {/* Call Note */}
                            <div>
                                <Label>Call Note</Label>
                                <textarea
                                    className="w-full border rounded-md p-2 mt-1"
                                    rows={4}
                                    value={data.call_note}
                                    onChange={(e) => setData("call_note", e.target.value)}
                                    placeholder="Write call summary..."
                                />
                            </div>
                            {/* Call Status */}
                            <div>
                                <Label>Call Status</Label>
                                <select
                                    className="w-full border rounded-md p-2 mt-1"
                                    value={data.call_status}
                                    onChange={(e) =>
                                        setData("call_status", e.target.value as "New" | "Contacted" | "Qualified" | "Lost" | "Converted")
                                    }
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Qualified">Qualified</option>
                                    <option value="Lost">Lost</option>
                                    <option value="Converted">Converted</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                Save Call
                            </Button>

                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-100 text-red-700 p-3 rounded">
                                    {Object.values(errors)[0]}
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}