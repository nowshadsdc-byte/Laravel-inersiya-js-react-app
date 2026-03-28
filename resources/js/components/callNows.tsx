import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Lead } from "@/types/Lead";
import { toast } from "sonner";
import { da } from "date-fns/locale";

type Props = {
  data: Lead;
  isEdit?: boolean;
  statuses?: Status[];
  sources?: Source[];
  users?: { id: number; name: string }[];
  town?: any;
};

const CallNows: React.FC<Props> = ({
  data,
  isEdit = false,
  statuses = [],
  sources = [],
  users = [],
  town = [],
}) => {
  const { data: formData, setData, put, processing, errors } = useForm({
    lead_id: data.id,
    name: data.name || "",
    email: data.email || "",
    phone: data.phone || "",
    whatsapp_number: data.whatsapp_number || "",
    town: data.town || "",
    address: data.address || "",
    status_id: data.status_id || "",
    source_id: data.source_id || "",
    assigned_to: String(data.assigned_to) || "",
    interest: data.profile?.interest || "",
  });

  const handleUpdate = () => {
    put(`/leads/edit/${data.id}`, {
      onError: (err) => {
        // Handle validation errors here if needed
        toast.error("Failed to update lead. Please check the form for errors.");
      },
      onSuccess: () => {
        toast.success("Lead updated successfully!");
      },
    });
  };

  const Input = (name: keyof typeof formData) => (
    <input
      value={formData[name] as string}
      onChange={(e) => setData(name, e.target.value)}
      className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400"
    />
  );

  const Select = (
    name: keyof typeof formData,
    options: any[],
    labelKey = "name"
  ) => (
    <select
      value={formData[name] as string}
      onChange={(e) => setData(name, e.target.value)}
      className="w-full border rounded px-2 py-1"
    >
      <option value="">Select</option>
      {options.map((item) => (
        <option key={item.id} value={item.id}>
          {item[labelKey]}
        </option>
      ))}
    </select>
  );

  const Row = ({
    label,
    name,
    children,
  }: {
    label: string;
    name?: keyof typeof formData;
    children: React.ReactNode;
  }) => (
    <tr className="border-b">
      <td className="p-3 font-medium bg-gray-50 w-1/3">{label}</td>
      <td className="p-3">{children}
        {name && errors[name] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[name]}
          </p>
        )}
      </td>
    </tr>
  );
 console.log(data);
  return (
    <div className="max-w-2xl mx-auto border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          <Row label="Name" name="name">
            {isEdit ? Input("name") : data.name}
          </Row>

          <Row label="Email" name="email">
            {isEdit ? Input("email") : data.email}
          </Row>

          <Row label="Phone" name="phone">
            {isEdit ? Input("phone") : data.phone}
          </Row>

          <Row label="WhatsApp" name="whatsapp_number">
            {isEdit ? Input("whatsapp_number") : data.whatsapp_number || "N/A"}
          </Row>
          <Row label="Interest" name="interest">
            {isEdit ? Input("interest") : data.profile?.interest || "N/A"}
          </Row>

          <Row label="Town" name="town">
            {isEdit ? Input("town") : data.town || "N/A"}
          </Row>

          <Row label="Address" name="address">
            {isEdit ? Input("address") : data.address || "N/A"}
          </Row>

          <Row label="Status" name="status_id">
            {isEdit ? (
              Select("status_id", statuses)
            ) : (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                {data.status?.name}
              </span>
            )}
          </Row>

          <Row label="Source" name="source_id">
            {isEdit ? (
              Select("source_id", sources)
            ) : (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                {data.source?.name || "N/A"}
              </span>
            )}
          </Row>

          <Row label="Assigned To" name="assigned_to">
            {isEdit ? (
              Select("assigned_to", users)
            ) : (
              data.assigned_to || "Not Assigned"
            )}
          </Row>

          {/* Read-only fields */}
          <Row label="Calls">{data.calls.length}</Row>
          <Row label="Notes">{data.notes.length}</Row>
          <Row label="Reminders">{data.reminders.length}</Row>

          <Row label="Created At" name="created_at">
            {new Date(data.created_at).toLocaleString()}
          </Row>

          <Row label="Updated At">
            {new Date(data.updated_at).toLocaleString()}
          </Row>

          {/* Update Button */}
          {isEdit && (
            <tr>
              <td colSpan={2} className="p-3">
                <div className="flex justify-end">
                  <Button onClick={handleUpdate} disabled={processing}>
                    {processing ? "Updating..." : "Update"}
                  </Button>
                </div>
              </td>
            </tr>
          )}

        </tbody>
      </table>
      {Object.keys(errors).length > 0 && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-600 text-sm">
          Please fix the errors below.
        </div>
      )}
    </div>
  );
};

export default CallNows;