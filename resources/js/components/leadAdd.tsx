import { useForm } from "@inertiajs/react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LeadSource } from "@/lib/data";
import { LeadStatus, User } from "@/types/Lead";

export default function AddLead({ leadSources, leadStatuses, assignedTos ,townNames}: { leadSources: LeadSource[]; leadStatuses: LeadStatus[]; assignedTos: User[] ,townNames: string[]}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        whatsapp_number: '',
        status_id: '',
        source_id: '',
        assigned_to: '',
        lead_notes: '',
        town: '',
        address: '',
        company: '',
        lead_sources:'',
        lead_statuses:'',
        lead_profiles:'',
        lead_calls:'',
        lead_reminders:'',
        lead_activities:'',
        occupation:'',
        interest: ' ',


    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leads/create', {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <h1>Lead Add Component</h1>
            <form method="post" onSubmit={submit}>
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <div className="text-red-600">{errors.name}</div>}
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                    {errors.email && <div className="text-red-600">{errors.email}</div>}
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input type="text" id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                    {errors.phone && <div className="text-red-600">{errors.phone}</div>}
                </div>  
                <div>
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input type="text" id="whatsapp_number" value={data.whatsapp_number} onChange={e => setData('whatsapp_number', e.target.value)} placeholder="+88017-XXX -XXX" />
                    {errors.whatsapp_number && <div className="text-red-600">{errors.whatsapp_number}</div>}
                </div>
                <div>
                    <Label htmlFor="status_id">Status</Label>
                    <select id="status_id" value={data.status_id} onChange={e => setData('status_id', e.target.value)}>
                        <option value="">Select Status</option>
                        {leadStatuses.map((status: LeadStatus) => (
                            <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                    </select>
                    {errors.status_id && <div className="text-red-600">{errors.status_id}</div>}
                </div>
                <div>
                    <Label htmlFor="source_id">Source ID</Label>
                    <select id="source_id" value={data.source_id} onChange={e => setData('source_id', e.target.value)}>
                        <option value="">Select Source</option>
                        {leadSources.map((source: LeadSource) => (
                            <option key={source.id} value={source.id}>{source.name}</option>
                        ))}
                    </select>
                    {errors.source_id && <div className="text-red-600">{errors.source_id}</div>}
                </div>
                <div>
                    <Label htmlFor="assigned_to">Assigned To</Label>
                    <select id="assigned_to" value={data.assigned_to} onChange={e => setData('assigned_to', e.target.value)}>
                        <option value="">Select User</option>
                        {assignedTos.map((user: User) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    {errors.assigned_to && <div className="text-red-600">{errors.assigned_to}</div>}
                </div>
                <div>
                    <Label htmlFor="town">Town</Label>
                    <select id="town" value={data.town} onChange={e => setData('town', e.target.value)}>
                        <option value="">Select Town</option>
                        {townNames.map((town: string) => (
                            <option key={town} value={town}>{town}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label htmlFor="lead_notes">Lead Notes</Label>
                    <textarea className="border" id="lead_notes" value={data.lead_notes} onChange={e => setData('lead_notes', e.target.value)} />
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
     


        </>
    );
}
