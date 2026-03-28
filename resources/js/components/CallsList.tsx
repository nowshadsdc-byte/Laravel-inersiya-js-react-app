import React from "react";

type Call = {
  id: number;
  lead_id: number;
  user_id: number;
  called_at: string;
  remarks: string;
  result: string;
  created_at: string | null;
  updated_at: string | null;
};

type Props = {
  calls: Call[];
};

const resultStyles = {
  answered: "bg-green-100 text-green-600",
  interested: "bg-green-100 text-green-600",
  converted: "bg-green-100 text-green-600",

  no_answer: "bg-gray-100 text-gray-600",
  unavailable: "bg-gray-100 text-gray-600",
  busy: "bg-yellow-100 text-yellow-600",
  call_back_later: "bg-yellow-100 text-yellow-600",

  meeting_scheduled: "bg-blue-100 text-blue-600",
  qualified: "bg-blue-100 text-blue-600",
  proposal_sent: "bg-purple-100 text-purple-600",

  not_interested: "bg-red-100 text-red-600",
  rejected: "bg-red-100 text-red-600",
  wrong_person: "bg-red-100 text-red-600",
  invalid_number: "bg-red-100 text-red-600",
};

const CallsList: React.FC<Props> = ({ calls }) => {
  if (!calls || calls.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No calls available
      </div>
    );
  }

  
  return (
    <div className="space-y-3">
      {calls.map((call) => (
        <div
          key={call.id}
          className="p-4 border rounded-xl bg-white shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">
              Caller ID: {call.id}
            </span>

            <span
              className={`text-xs px-2 py-1 rounded ${resultStyles[call.result as keyof typeof resultStyles] || "bg-gray-100 text-gray-600"
                }`}
            >
              {call.result}
            </span>
          </div>

          <div className="text-sm text-gray-700">
            <p>
              <strong>Remarks:</strong> {call.remarks}
            </p>

            <p className="mt-1">
              <strong>Called Time:</strong>{" "}
              {new Date(call.called_at).toLocaleString()}
            </p>
            <p>
              {call.user_id ? (
                <>
                  <strong>Called By:</strong>{call.user.name }
                </>
              ) : null}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CallsList;