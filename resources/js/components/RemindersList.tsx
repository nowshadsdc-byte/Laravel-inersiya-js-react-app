import { Button } from '@headlessui/react';
import { router, useForm } from '@inertiajs/react';
import React from 'react';
import { Label } from 'recharts';

type Reminder = {
    id: number;
    lead_id: number;
    user_id: number;
    is_call: number;
    is_completed: number;
    remind_at: string;
    created_at: string;
    updated_at: string;
};

type Props = {
    reminders: Reminder[];
};

const RemindersList: React.FC<Props> = ({ reminders }) => {
    if (!reminders || reminders.length === 0) {
        return (
            <div className="py-6 text-center text-gray-400">
                No reminders available
            </div>
        );
    }
    const { data, post, processing, errors } = useForm({
        reminder_id: '',
        status: '',
    });

    const handelUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.reminder_id || !data.status) {
            alert('Please select a status to update.');
            return;
        }
        router.post(
            `/leads/update-reminder`,
            {
                status: data.status,
                reminder_id: data.reminder_id,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="space-y-3">
            {reminders.map((item) => (
                <div
                    key={item.id}
                    className="rounded-xl border bg-white p-4 shadow-sm transition hover:bg-gray-50"
                >
                    <div className="mb-2 flex justify-between">
                        <span className="text-sm font-semibold">
                            Reminder ID: {item.id}
                            <p>
                                <strong>Remind At:</strong>{' '}
                                {new Date(item.remind_at).toLocaleDateString(
                                    'en-GB',
                                    {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    },
                                )}
                            </p>
                        </span>

                        <div className="justify-content flex flex-col gap-2 rounded border-2 bg-blue-100 px-2 py-1">
                            <span
                                className={`rounded px-2 py-1 text-xs ${
                                    item.is_completed
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-yellow-100 text-yellow-600'
                                }`}
                            >
                                {item.is_completed ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-700">
                        <div>
                            <p className="mt-1">
                                <strong>Type:</strong>{' '}
                                {item.is_call
                                    ? 'Call Reminder'
                                    : 'General Reminder'}
                            </p>
                        </div>
                        <div className="rounded border bg-emerald-200 px-2 py-1">
                            <h1 className="border-2 py-2 font-bold">
                                Update Reminders
                            </h1>
                            <form onSubmit={handelUpdate}>
                                <Label
                                    htmlFor={`status-${item.id}`}
                                    className="mb-1 block text-xs font-medium text-gray-700"
                                >
                                    Update Status
                                </Label>
                                <select
                                    id={`status-${item.id}`}
                                    name="status"
                                    className="w-full rounded border px-2 py-1 font-medium text-gray-700"
                                    onChange={(e) => {
                                        data.reminder_id = item.id.toString();
                                        data.status = e.target.value;
                                    }}
                                >
                                    <option value="" selected>
                                        Select status
                                    </option>
                                    <option value="0">Mark as Pending</option>
                                    <option value="1">Mark as Completed</option>
                                </select>
                                <Button
                                    type="submit"
                                    className="text-2XL mt-2 w-full rounded bg-blue-600 text-white"
                                >
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Status'}
                                </Button>
                                {errors.status && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RemindersList;
