import { router } from '@inertiajs/react';
import React from 'react';
type Note = {
    id: number;
    lead_id: number;
    user_id: number;
    note: string;
    created_at: string | null;
    updated_at: string | null;
};

type Props = {
    notes: Note[];
};

const Notes: React.FC<Props> = ({ notes }) => {
    if (!notes || notes.length === 0) {
        return (
            <div className="py-6 text-center text-gray-400">
                No notes available
            </div>
        );
    }

    const sortedNotes = [...notes].sort((a, b) => {
        const dateA = new Date(a.created_at || '').getTime();
        const dateB = new Date(b.created_at || '').getTime();
        return dateB - dateA; // Sort in descending order
    });

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this note?')) {
            router.delete(`/leads/delete-note/${id}`);
        }
    };
    return (
        <div className="gap-2 space-y-3">
            {sortedNotes.map((item) => (
                <div
                    key={item.id}
                    className="rounded-xl border bg-white p-4 shadow-sm transition hover:bg-gray-50"
                >
                    <div className="text-sm font-medium text-gray-800">
                        {item.note}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>
                            Created at:{' '}
                            {new Date(item.created_at || '').toLocaleString()}
                        </span>
                        <div className="space-x-4">
                            <a href={`/leads/edit-note/${item.id}`}>Edit</a>
                            <a
                                className="text-red-500"
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Notes;
