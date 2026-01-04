import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Batch } from '@/types/Batch'
import { Course } from '@/types/Course'
import { Head, useForm } from '@inertiajs/react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Student',
        href: dashboard().url,
    },
]

interface Props {
    batchs: Batch[]
    courses: Course[]
}

export default function CreateStudent({ batchs, courses }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string
        father_name: string
        mother_name: string
        email: string
        phone: string
        address: string
        guardian_name: string
        guardian_phone: string
        guardian_relation: string
        status: string
        batch_id: number | null
        course_ids: number[]
        photo: File | null
    }>({
        name: '',
        father_name: '',
        mother_name: '',
        email: '',
        phone: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_relation: '',
        status: 'active',
        batch_id: null,
        course_ids: [],
        photo: null,
    })

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post('/students/create', {
            forceFormData: true,
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Student" />

            <div className="p-6 m-6 max-w-4xl">
                <form onSubmit={submit} className="space-y-5">

                    {/* Student Name */}
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Student Name"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    {/* Father & Mother */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Father Name</Label>
                            <Input
                                value={data.father_name}
                                onChange={(e) => setData('father_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Mother Name</Label>
                            <Input
                                value={data.mother_name}
                                onChange={(e) => setData('mother_name', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <Label>Address</Label>
                        <textarea
                            className="w-full border rounded px-3 py-2"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                    </div>

                    {/* Guardian Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Guardian Name</Label>
                            <Input
                                value={data.guardian_name}
                                onChange={(e) => setData('guardian_name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Guardian Phone</Label>
                            <Input
                                value={data.guardian_phone}
                                onChange={(e) => setData('guardian_phone', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Relation</Label>
                            <Input
                                value={data.guardian_relation}
                                onChange={(e) =>
                                    setData('guardian_relation', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Batch */}
                    <div>
                        <Label>Batch</Label>
                        <select
                            className="border rounded px-3 py-2 w-full"
                            value={data.batch_id ?? ''}
                            onChange={(e) =>
                                setData(
                                    'batch_id',
                                    e.target.value ? Number(e.target.value) : null
                                )
                            }
                        >
                            <option value="">-- Select Batch --</option>
                            {batchs.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                        {errors.batch_id && (
                            <p className="text-red-500">{errors.batch_id}</p>
                        )}
                    </div>

                    {/* Courses */}
                    <div>
                        <Label>Courses</Label>
                        <select
                            multiple
                            className="border rounded px-3 py-2 w-full"
                            value={data.course_ids.map(String)}
                            onChange={(e) => {
                                const selected = Array.from(
                                    e.target.selectedOptions
                                ).map((o) => Number(o.value))
                                setData('course_ids', selected)
                            }}
                        >
                            {courses.map((course) => (
                                <option key={course.id} value={course.id ? course.id : ' '}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Photo */}
                    <div>
                        <Label>Student Photo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData(
                                    'photo',
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Add Student'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    )
}
