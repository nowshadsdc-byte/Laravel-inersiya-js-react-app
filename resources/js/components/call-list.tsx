import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function CallList({
    ButtonLabel = 'Add Note',
    leadID,
}: {
    ButtonLabel?: string;
    leadID: number;
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        id: leadID,
        result: '',
        remarks: '',
        called_at: new Date().toISOString(),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = data.result;
        const remarks = data.remarks;

        // Perform validation if needed
        if (!result) {
            alert('Please select a result.');
            return;
        }
        if (remarks.length > 500) {
            alert('Remarks cannot exceed 500 characters');
            return;
        }

        // Send data to the server using Inertia.js
        router.post(
            `/leads/add-call-log/${leadID}`,
            {
                result,
                remarks,
                called_at: data.called_at,
            },
            {
                onSuccess: () => {
                    setData('result', '');
                    setData('remarks', '');
                    setOpen(false);
                },
            },
        );
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">{ButtonLabel}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Call Now</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="result">Result</Label>
                                <select
                                    id="result"
                                    value={data.result}
                                    onChange={(e) =>
                                        setData('result', e.target.value)
                                    }
                                    className="mt-1 w-full rounded border p-2"
                                >
                                    <option value="">Select Result</option>
                                    <option value="answered">Answered</option>
                                    <option value="no_answer">No Answer</option>
                                    <option value="busy">Busy</option>

                                    <option value="unavailable">
                                        Unavailable
                                    </option>

                                    <option value="interested">
                                        Interested
                                    </option>
                                    <option value="not_interested">
                                        Not Interested
                                    </option>

                                    <option value="call_back_later">
                                        Call Back Later
                                    </option>

                                    <option value="meeting_scheduled">
                                        Meeting Scheduled
                                    </option>
                                    <option value="qualified">Qualified</option>

                                    <option value="proposal_sent">
                                        Proposal Sent
                                    </option>

                                    <option value="converted">Converted</option>
                                    <option value="wrong_person">
                                        Wrong Person
                                    </option>
                                    <option value="invalid_number">
                                        Invalid Number
                                    </option>

                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="Remarks">Remarks</Label>
                                <Textarea
                                    id="Remarks"
                                    value={data.remarks}
                                    onChange={(e) =>
                                        setData('remarks', e.target.value)
                                    }
                                    className="mt-1 w-full rounded border p-2"
                                    rows={4}
                                    placeholder="Add Remarks"
                                />
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button type="submit">
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                            {errors.result && (
                                <p className="mt-2 text-red-500">
                                    {errors.result}
                                </p>
                            )}
                            {errors.remarks && (
                                <p className="mt-2 text-red-500">
                                    {errors.remarks}
                                </p>
                            )}
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
