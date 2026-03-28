import { LeadSource } from '@/lib/data';
import { LeadStatus, User } from '@/types/Lead';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function AddLead({
    leadSources,
    leadStatuses,
    assignedTos,
    townNames,
    interests,
}: {
    leadSources: LeadSource[];
    leadStatuses: LeadStatus[];
    assignedTos: User[];
    townNames: string[];
    interests: string[];
}) {
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
        lead_sources: '',
        lead_statuses: '',
        lead_profiles: '',
        lead_calls: '',
        lead_reminders: '',
        lead_activities: '',
        occupation: '',
        interest: '',
        reminder_at: '',
    });

    const [filteredInterests, setFilteredInterests] = useState<string[]>([]);
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/leads/create', {
            onSuccess: () => reset(),
        });
    };

    const handleSearch = (query: string) => {
        const filteredInterests = interests.filter((interest) =>
            interest.toLowerCase().includes(query.toLowerCase()),
        );
        setFilteredInterests(filteredInterests);
    };

    return (
        <>
            <form method="post" onSubmit={submit} className="space-y-6">
                {/* Basic info */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            required={true}
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Phone numbers */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                            required={true}
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-600">
                                {errors.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="whatsapp_number">WhatsApp</Label>
                        <Input
                            id="whatsapp_number"
                            placeholder="+88017-XXX-XXXX"
                            value={data.whatsapp_number}
                            onChange={(e) =>
                                setData('whatsapp_number', e.target.value)
                            }
                        />
                        {errors.whatsapp_number && (
                            <p className="text-sm text-red-600">
                                {errors.whatsapp_number}
                            </p>
                        )}
                    </div>
                </div>

                {/* Selects – side by side */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label>Status *</Label>
                        <select
                            required={true}
                            className="w-full rounded-md border px-3 py-2"
                            value={data.status_id}
                            onChange={(e) =>
                                setData('status_id', e.target.value)
                            }
                        >
                            <option value="">Select Status</option>
                            {leadStatuses.map((status) => (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                        {errors.status_id && (
                            <p className="text-sm text-red-600">
                                {errors.status_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Source</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2"
                            value={data.source_id}
                            onChange={(e) =>
                                setData('source_id', e.target.value)
                            }
                        >
                            {leadSources.map((source) => (
                                <option key={source.id} value={source.id}>
                                    {source.name}
                                </option>
                            ))}
                        </select>
                        {errors.source_id && (
                            <p className="text-sm text-red-600">
                                {errors.source_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Assigned To</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2"
                            value={data.assigned_to}
                            onChange={(e) =>
                                setData('assigned_to', e.target.value)
                            }
                        >
                            {assignedTos.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        {errors.assigned_to && (
                            <p className="text-sm text-red-600">
                                {errors.assigned_to}
                            </p>
                        )}
                        {errors.assigned_to && (
                            <p className="text-sm text-red-600">
                                {errors.assigned_to}
                            </p>
                        )}
                    </div>
                </div>
                {/* Town */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    <div>
                        <Label>Town</Label>
                        <select
                            className="w-full rounded-md border px-3 py-2"
                            value={data.town}
                            onChange={(e) => setData('town', e.target.value)}
                        >
                            {townNames.map((town) => (
                                <option key={town} value={town}>
                                    {town}
                                </option>
                            ))}
                        </select>
                        {errors.town && (
                            <p className="text-sm text-red-600">
                                {errors.town}
                            </p>
                        )}
                    </div>
                    <div className="">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-600">
                                {errors.address}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input
                            id="occupation"
                            value={data.occupation}
                            onChange={(e) =>
                                setData('occupation', e.target.value)
                            }
                        />
                        {errors.occupation && (
                            <p className="text-sm text-red-600">
                                {errors.occupation}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label id="interest">interest</Label>
                        <div className="relative w-full">
                            <Input
                                id="interest"
                                value={data.interest}
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData('interest', value);
                                    handleSearch(value);
                                }}
                            />

                            {filteredInterests.length > 0 && (
                                <div className="absolute bottom-full z-50 mb-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                                    {filteredInterests.map((item, index) => (
                                        <div
                                            key={index}
                                            className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                                            onClick={() => {
                                                setData('interest', item);
                                                setFilteredInterests([]);
                                            }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            value={data.company}
                            onChange={(e) => setData('company', e.target.value)}
                        />
                        {errors.company && (
                            <p className="text-sm text-red-600">
                                {errors.company}
                            </p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <Label htmlFor="lead_notes">Lead Notes</Label>
                    <textarea
                        id="lead_notes"
                        rows={4}
                        className="w-full rounded-md border px-3 py-2"
                        value={data.lead_notes}
                        onChange={(e) => setData('lead_notes', e.target.value)}
                    />
                    {errors.lead_notes && (
                        <p className="text-sm text-red-600">
                            {errors.lead_notes}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full md:w-auto"
                    >
                        {processing ? 'Submitting…' : 'Submit Lead'}
                    </Button>
                </div>
            </form>
        </>
    );
}
