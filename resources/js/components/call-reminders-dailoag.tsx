import { Label } from "recharts"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { toDate } from "date-fns"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import { Input } from "./ui/input"

export function CallRemindersDialog({ ButtonLabel = "Add Reminder" , leadID}: { ButtonLabel?: string, leadID: number  }) {
    const [open, setOpen] = useState(false);

    const {data, post , processing, reset} = useForm({
        lead_id: leadID,
        remind_time: '',
        status: '0',
    })
    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/leads/add-reminder/${leadID}`, {
            onSuccess: () => {
                reset();
                setOpen(false);
            }
        });
    }
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">{ButtonLabel}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader> 
                        <DialogTitle>Add Reminder</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div>
                                    <Label to="reminder">Next Remind Time</Label>
                                    <Input required type="date" id="reminder" onChange={(e) => data.remind_time = e.target.value} className="w-full border rounded p-2 mt-1" />
                                </div>
                                <div className="mt-4">
                                    <Label> lead Remind Staus</Label>
                                    <select required className="w-full border rounded p-2 mt-1" value={data.status} onChange={(e) => data.status = e.target.value}>
                                        <option value="0">Pending</option>
                                        <option value="1">Completed</option>
                                    </select>
                                </div>
                            
                                <div className="flex justify-end mt-4">
                                    <Button type="submit">Save</Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
}