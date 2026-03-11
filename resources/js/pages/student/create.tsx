import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Batch } from '@/types/Batch'
import { Course } from '@/types/Course'
import { Head, useForm } from '@inertiajs/react'
import { useEffect } from 'react'

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
    const { data, setData, post, processing, errors } = useForm({
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
        batch_id: null as number | null,
        course_ids: [] as number[],
        photo: null as File | null,
    })

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post('/students/create', {
            forceFormData: true,
            preserveScroll: true,
        })
    }
    useEffect(() => {
        const firstErrorKey = Object.keys(errors)[0]
        if (firstErrorKey) {
            document.querySelector(`[name="${firstErrorKey}"]`)?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [errors])



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Student" />
            <div className="p-6 m-6 max-w-4xl">
                <form onSubmit={submit} className="space-y-5">
                    {/* Student Name */}
                    <div>
                        <Label className="my-2">Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Father & Mother */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="my-2">Father Name</Label>
                            <Input
                                value={data.father_name}
                                onChange={(e) => setData('father_name', e.target.value)}
                            />
                            {errors.father_name && (
                                <p className="text-red-500 text-sm">{errors.father_name}</p>
                            )}
                        </div>

                        <div>
                            <Label className="my-2">Mother Name</Label>
                            <Input
                                value={data.mother_name}
                                onChange={(e) => setData('mother_name', e.target.value)}
                            />
                            {errors.mother_name && (
                                <p className="text-red-500 text-sm">{errors.mother_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="my-2">Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label className="my-2">Phone</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <Label className="my-2">Address</Label>
                        <textarea
                            className="w-full border rounded px-3 py-2"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm">{errors.address}</p>
                        )}
                    </div>

                    {/* Guardian Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className="my-2">Guardian Name</Label>
                            <Input
                                value={data.guardian_name}
                                onChange={(e) => setData('guardian_name', e.target.value)}
                            />
                            {errors.guardian_name && (
                                <p className="text-red-500 text-sm">{errors.guardian_name}</p>
                            )}
                        </div>

                        <div>
                            <Label className="my-2">Guardian Phone</Label>
                            <Input
                                value={data.guardian_phone}
                                onChange={(e) => setData('guardian_phone', e.target.value)}
                            />
                            {errors.guardian_phone && (
                                <p className="text-red-500 text-sm">{errors.guardian_phone}</p>
                            )}
                        </div>

                        <div>
                            <Label className="my-2">Relation</Label>
                            <Input
                                value={data.guardian_relation}
                                onChange={(e) => setData('guardian_relation', e.target.value)}
                            />
                            {errors.guardian_relation && (
                                <p className="text-red-500 text-sm">
                                    {errors.guardian_relation}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Batch */}
                    <div>
                        <Label className="my-2">Batch</Label>
                        <select
                            className="border rounded px-3 py-2 w-full"
                            value={data.batch_id ?? ''}
                            onChange={(e) =>
                                setData('batch_id', e.target.value ? Number(e.target.value) : null)
                            }
                        >
                            <option value="">-- Select Batch --</option>
                            {batchs.map((batch) => (
                                <option key={batch.id} value={batch.id.toString()}>
                                    {batch.name} -- {batch.course_id && courses.find(c => c.id === batch.course_id)?.name}
                                </option>
                            ))}
                        </select>
                        {errors.batch_id && (
                            <p className="text-red-500 text-sm">{errors.batch_id}</p>
                        )}
                    </div>

                    {/* Courses */}
                    <div>
                        <Label className="my-2">Courses</Label>
                        <select
                            multiple
                            className="border rounded px-3 py-2 w-full"
                            value={data.course_ids.map(String)}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions).map((o) =>
                                    Number(o.value)
                                )
                                setData('course_ids', selected)
                            }}
                        >
                            {courses.map((course) => (
                                course.id && (
                                    <option key={course.id} value={course.id.toString()}>
                                        {course.name}
                                    </option>
                                )
                            ))}
                        </select>
                        {errors.course_ids && (
                            <p className="text-red-500 text-sm">{errors.course_ids}</p>
                        )}
                        {errors['course_ids.0'] && (
                            <p className="text-red-500 text-sm">
                                One of the selected courses is invalid.
                            </p>
                        )}
                    </div>

                    {/* Photo */}
                    <div>
                        <Label className="my-2">Student Photo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData('photo', e.target.files ? e.target.files[0] : null)
                            }
                        />
                        {errors.photo && (
                            <p className="text-red-500 text-sm">{errors.photo}</p>
                        )}
                    </div>


                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Add Student'}
                    </Button>
                </form>


            </div>
        </AppLayout>
    )
}
