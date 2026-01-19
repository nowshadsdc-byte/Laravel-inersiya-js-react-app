import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, } from '@/types';
import { Head, useForm } from '@inertiajs/react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Role',
        href: dashboard().url,
    },
];
export default function edit({ role, permissions, rolePermitssions }: any) {
    interface FormData {
        name: string;
        permission_ids: number[];
        guard_name: string;
    }

    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: role.name,
        permission_ids: role.permissions.map((p: any) => p.id),
        guard_name: role.guard_name,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/role/update/${role.id}`, {
            forceFormData: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Role" />
            <div className='m-6'>
                <form onSubmit={submit}>
                    <div>
                        <label className='block mb-2'>Role Name</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className='border rounded px-3 py-2 w-full' />
                        {errors.name && <div className='text-red-600 mt-2'>{errors.name}</div>}
                    </div>
                    <div className='mt-4'>
                        <label className='block mb-2'>Guard Name</label>
                        <select
                            value={data.guard_name}
                            onChange={(e) => setData('guard_name', e.target.value)}
                            className='border rounded px-3 py-2 w-full mt-2'
                        >
                            <option selected value="web">web</option>
                        </select>
                        {errors.guard_name && <div className='text-red-600 mt-2'>{errors.guard_name}</div>}
                    </div>
                    <div className='mt-4'>
                        <label className='block mb-2'>Permissions</label>
                        {permissions.map((permission: any) => {
                            const isChecked = data.permission_ids.includes(permission.id)

                            return (
                                <label
                                    key={permission.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={permission.id}
                                        checked={isChecked}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setData('permission_ids', [...data.permission_ids, permission.id])
                                            } else {
                                                setData(
                                                    'permission_ids',
                                                    data.permission_ids.filter((id: number) => id !== permission.id)
                                                )
                                            }
                                        }}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm">{permission.name}</span>
                                    <span className="text-sm">{role.name}</span>
                                </label>
                            )
                        })}
                        {errors.permission_ids && <div className='text-red-600 mt-2'>{errors.permission_ids}</div>}
                    </div>
                    <div className='mt-6'>
                        <Button type="submit" disabled={processing} >
                            {processing ? 'Updating...' : 'Update Role'}
                        </Button>
                    </div>
                </form>

            </div>
        </AppLayout>
    );
}
