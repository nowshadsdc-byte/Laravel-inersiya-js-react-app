import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { router, useForm } from "@inertiajs/react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    lead: any,
    error?: string
}

export function CallNow({ open, onOpenChange, lead }: Props) {

    interface FormData {
        lead_id: string | number
        type: "call" | "note" | "status_change" | "reminder"
        description: string
        called_at: string
        result: string
        remarks: string
        remind_at: string
        is_completed: boolean
        note: string,
        status_change: "New" | "contacted" | "qualified" | "lost" | "converted"
    }

    const { data, setData, post, processing, reset, errors } = useForm<FormData>({
        lead_id: lead?.id ?? "",
        type: "call",
        description: " ",
        called_at: "",
        result: "not_reachable",
        remarks: "",
        remind_at: "",
        is_completed: false,
        note: "",
        status_change: "contacted"
    })

    if (!lead) return null

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post(`/leads/call-center/${lead.id}`, {
            onSuccess: () => {
                reset()               // optional: clear the form
                onOpenChange(false)   // close the dialog
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>
                        {lead.id}. {lead.name} – {lead.phone}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6">

                    {/* LEFT SIDE – Lead Info */}
                    <div className="border rounded-lg p-4 space-y-3">
                        <p><strong>Whatsapp:</strong> {lead.whatsapp_number}</p>
                        <p><strong>Email:</strong> {lead.email}</p>
                        <p><strong>Address:</strong> {lead.address}, {lead.town}</p>
                        <p><strong>Interest:</strong> {lead.profile?.interest}</p>
                    </div>

                    {/* RIGHT SIDE – Activity Form */}
                    <div className="border rounded-lg p-4">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Activity Type */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Activity Type
                                </label>
                                <select
                                    className="w-full border rounded p-2"
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value as "call" | "note" | "status_change" | "reminder")}
                                >
                                    <option value="call">Call</option>
                                    <option value="note">Note</option>
                                    <option value="status_change">Status Change</option>
                                    <option value="reminder">Reminder</option>
                                </select>
                            </div>

                            {/* CALL FIELDS */}
                            {data.type === "call" && (
                                <>
                                    <input
                                        type="datetime-local"
                                        className="w-full border rounded p-2"
                                        value={data.called_at}
                                        onChange={(e) => setData("called_at", e.target.value)}
                                    />

                                    <select
                                        className="w-full border rounded p-2"
                                        value={data.result}
                                        onChange={(e) => setData("result", e.target.value)}
                                    >
                                        <option value="answered">Answered</option>
                                        <option value="missed">Missed</option>
                                        <option value="busy">Busy</option>
                                        <option value="not_reachable">Not Reachable</option>
                                    </select>

                                    <textarea
                                        placeholder="Remarks"
                                        className="w-full border rounded p-2"
                                        value={data.remarks}
                                        onChange={(e) => setData("remarks", e.target.value)}
                                    />

                                    <textarea
                                        placeholder="Write note"
                                        className="w-full border rounded p-2"
                                        value={data.note}
                                        onChange={(e) => setData("note", e.target.value)}
                                    />
                                </>
                            )}

                            {/* NOTE FIELD */}
                            {data.type === "note" && (
                                <textarea
                                    placeholder="Write note"
                                    className="w-full border rounded p-2"
                                    value={data.note}
                                    onChange={(e) => setData("note", e.target.value)}
                                />
                            )}

                            {/* REMINDER FIELD */}
                            {data.type === "reminder" && (
                                <>

                                    <input
                                        type="datetime-local"
                                        className="w-full border rounded p-2"
                                        value={data.remind_at}
                                        onChange={(e) => setData("remind_at", e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Remarks"
                                        className="w-full border rounded p-2"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                    />

                                </>
                            )}

                            {/* STATUS CHANGE */}
                            {data.type === "status_change" && (
                                <select
                                    className="w-full border rounded p-2"
                                    value={data.status_change}
                                    onChange={(e) => setData("status_change", e.target.value as "New" | "contacted" | "qualified" | "lost" | "converted")}
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="qualified">qualified</option>
                                    <option value="lost">lost</option>
                                    <option value="converted">converted</option>
                                </select>
                            )}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-black text-white py-2 rounded"
                            >
                                Save Activity
                            </Button>
                            {Object.keys(errors).length > 0 && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{Object.values(errors)[0]}</div>}
                        </form>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}