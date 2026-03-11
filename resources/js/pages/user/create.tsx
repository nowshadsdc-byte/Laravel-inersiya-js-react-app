import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";

interface FormData {
    name: string;
    email: string;
    password: string;
    role: string;
    general?: string;
}

export default function Create({ roles = [] }: { roles: Array<{ id: number; name: string }> }) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        role: '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/users/create', {
            forceFormData: true,

        });
    }

    return (
        <AppLayout>
            <Head title="Website Users" />
            <div className='w-[100%] flex items-center justify-between'>
                <h1 className="text-2xl font-bold my-6 mx-6">Add New User</h1>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md w-1/2 m-6 gap-3 flex flex-col">
                <form onSubmit={submit} method="post" className="flex flex-col gap-6 border p-6 rounded-md">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <input value={data.name} onChange={(e) => setData('name', e.target.value)} type="text" name="name" id="name" className="w-full border rounded-md p-2" />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <input value={data.email} onChange={(e) => setData('email', e.target.value)} type="email" name="email" id="email" className="w-full border rounded-md p-2" />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <input value={data.password} onChange={(e) => setData('password', e.target.value)} type="password" name="password" id="password" className="w-full border rounded-md p-2" />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <select value={data.role} onChange={(e) => setData('role', e.target.value)} name="role" id="role" className="w-full border rounded-md p-2">
                            <option value="">-- Select Role --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id.toString()}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                    </div>
                    <Button type="submit" className="mt-4 text-white px-4 py-2 rounded-md">
                        {processing ? 'Creating...' : 'Create User'}
                    </Button>
                </form>
                {errors.general && <span className="text-red-500 text-sm">{errors.general}</span>}
            </div>


        </AppLayout>
    );
}