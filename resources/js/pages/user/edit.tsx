import React, { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { Role, User, type BreadcrumbItem } from '@/types'
import { Head, useForm } from '@inertiajs/react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Update User',
        href: dashboard().url,
    },
]

interface FormData {
    name: string
    email: string
    roles: number[]
    profile_picture : File | null
}

interface Props {
    user: User
    roles: Role[],
    assignedRoles: Array<string | number>,
}

export default function edit({ user, roles }: Props): JSX.Element {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        name: user.name ?? '',
        email: user.email ?? '',
        roles: user.roles?.map(role => role.id) ?? [],
        profile_picture: null,
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        put(`/users/edit/${user.id}`, {
            forceFormData: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <div className='m-6 w-8/12'>
                <form onSubmit={submit} className="space-y-4">
                    <div className='profile_picture w-full flex  justify-between gap-6'>
                        <div className=''>
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="roles">Roles</Label>
                                <div className="flex flex-col gap-2 border p-3 rounded max-h-64 overflow-y-auto">
                                    {roles.map((role) => {
                                        const isChecked = data.roles.includes(role.id)

                                        return (
                                            <label
                                                key={role.id}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={role.id}
                                                    checked={isChecked}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setData('roles', [...data.roles, role.id])
                                                        } else {
                                                            setData(
                                                                'roles',
                                                                data.roles.filter(id => id !== role.id)
                                                            )
                                                        }
                                                    }}
                                                    className="h-4 w-4"
                                                />

                                                <span className="text-sm">{role.name}</span>
                                            </label>
                                        )
                                    })}
                                </div>

                                {errors.roles && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.roles}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label className='mb-6'>Profile Picture</Label>
                            <img src={user.profile_picture ? `/storage/${user.profile_picture}` : '/default-avatar.png'} alt={user.name} className="mb-4 h-32 w-32 rounded-full object-cover" />
                            
                            <Input type="file" onChange={e => {
                                const file = e.target.files?.[0];
                                setData('profile_picture', file || null);
                            }} />
                            {errors.profile_picture && <p className="text-red-500">{errors.profile_picture}</p>}    
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Updating…' : 'Update User'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    )
}
