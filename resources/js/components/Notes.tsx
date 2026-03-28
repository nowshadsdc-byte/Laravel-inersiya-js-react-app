import React from "react";
import { router } from "@inertiajs/react";
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
      <div className="text-center text-gray-400 py-6">
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
  }
  return (
    <div className="space-y-3 gap-2">
      {sortedNotes.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-xl bg-white shadow-sm hover:bg-gray-50 transition"
        >
          <div className="text-sm font-medium text-gray-800">
            {item.note}
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <span>Created at: {new Date(item.created_at || '').toLocaleString()}</span>
            <div className="space-x-4">
              <a href={`/leads/edit-note/${item.id}`}>
                Edit
              </a>
              <a className="text-red-500" onClick={() => handleDelete(item.id)}>
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