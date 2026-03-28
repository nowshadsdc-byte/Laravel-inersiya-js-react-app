import { Label } from "recharts"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { da } from "date-fns/locale";

export function CallDailoag({ ButtonLabel = "Add Note" , leadID }: { ButtonLabel?: string, leadID: number }) {
    const [open, setOpen] = useState(false);

    const {data, setData, post, processing, errors} = useForm({
        id:leadID,
        note: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(data.note.trim() === '') {
            alert('Note cannot be empty');
            return;
        }
        post(`/leads/add-note/${leadID}`, {
            onSuccess: () => {
                setData('note', '');
                setOpen(false);
            }
        });
        data.note = '';
        data.id = leadID;
        setOpen(false); 

    }
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">{ButtonLabel}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader> 
                        <DialogTitle>Add Note</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <Label to="note">Note</Label>
                                    <Textarea id="note" value={data.note} onChange={(e) => setData('note', e.target.value)} className="w-full border rounded p-2 mt-1" rows={4} placeholder="Add Note"/>
                                    
                                </div>
                                <div className="flex justify-end mt-4">
                                    <Button type="submit">{processing ? "Saving..." : "Save"}</Button>
                                </div>
                                {errors.note && <p className="text-red-500 mt-2">{errors.note}</p>}
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
}