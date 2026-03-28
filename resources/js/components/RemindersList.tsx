import { Button } from "@headlessui/react";
import { router, useForm } from "@inertiajs/react";
import { id } from "date-fns/locale";
import React from "react";
import { Label } from "recharts";

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
      <div className="text-center text-gray-400 py-6">
        No reminders available
      </div>
    );
  }
  const {data, post ,processing, errors} = useForm({
    reminder_id: "",
    status: "",
  });

  const handelUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!data.reminder_id || !data.status){
      alert("Please select a status to update.");
      return;
    }
   router.post(`/leads/update-reminder`, {
    status: data.status,
    reminder_id: data.reminder_id,
   },{
    preserveState: true,
    preserveScroll: true,
   });
  }

  return (
    <div className="space-y-3">
      {reminders.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-xl bg-white shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold">
              Reminder ID: {item.id}
              <p>
                <strong>Remind At:</strong>{" "}
                {new Date(item.remind_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </span>

            <div className="flex flex-col justify-content gap-2 bg-blue-100 px-2 py-1 rounded border-2">
              <span
                className={`text-xs px-2 py-1 rounded ${item.is_completed
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
                  }`}
              >
                {item.is_completed ? "Completed" : "Pending"}
              </span>
            </div>


          </div>

          <div className="text-sm text-gray-700 flex justify-between items-center">
            <div>
              

              <p className="mt-1">
                <strong>Type:</strong>{" "}
                {item.is_call ? "Call Reminder" : "General Reminder"}
              </p>
            </div>
            <div className="bg-emerald-200 px-2 py-1  rounded border">
              <h1 className="font-bold border-2 py-2">Update Reminders</h1>
              <form onSubmit={handelUpdate}>
                <Label htmlFor={`status-${item.id}`} className="block text-xs font-medium text-gray-700 mb-1">
                  Update Status
                </Label>
                <select id={`status-${item.id}`} name="status" className="font-medium text-gray-700 border rounded w-full px-2 py-1"
                onChange={(e) => {
                  data.reminder_id = item.id.toString();
                  data.status = e.target.value;
              }}
                >
                  <option value=""  selected>
                    Select status
                  </option>
                  <option value="0">
                    Mark as Pending
                  </option>
                  <option value="1" >
                    Mark as Completed
                  </option>
                </select>
                <Button type="submit" className="mt-2 w-full bg-blue-600 text-white text-2XL rounded">
                  {processing ? "Updating..." : "Update Status"}
                </Button>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RemindersList;