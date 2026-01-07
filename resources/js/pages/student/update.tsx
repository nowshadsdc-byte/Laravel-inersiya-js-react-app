import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student Update',
        href: dashboard().url,
    },
];

interface Student {
    id: string | number;
    name: string;
    father_name: string;
    mother_name: string;
    student_uid?: string | null;
    phone?: string | null;
    email: string;
    photo?: File | string | null;
    address?: string | null;
    guardian_name?: string | null;
    guardian_phone?: string | null;
    guardian_relation?: string | null;
    status: 'active' | 'inactive';
    batch_id: string | number | null;
    course_ids: (string | number)[];
    student_course_ids: (string | number)[];
}

interface Batch {
    id: string | number;
    name: string;
}

interface Course {
    id: string | number;
    name: string;
}

interface Props {
    student: Student;
    batches: Batch[];
    courses: Course[];
}


export default function StudentEdit({ student, batches, courses }: Props) {

    const { data, setData, put, errors } = useForm<Student>({
        id: student.id,
        name: student.name,
        father_name: student.father_name,
        mother_name: student.mother_name,
        student_uid: student.student_uid ?? '',
        phone: student.phone ?? '',
        email: student.email,
        photo: student.photo ?? '',
        address: student.address ?? '',
        guardian_name: student.guardian_name ?? '',
        guardian_phone: student.guardian_phone ?? '',
        guardian_relation: student.guardian_relation ?? '',
        status: student.status,
        batch_id: student.batch_id ?? '',
        course_ids: student.course_ids ?? [],
        student_course_ids: student.student_course_ids

    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/students/edit/${student.id}`);
    };

console.log('student_course_ids')
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Student" />

            <div className="m-6">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="w-3/12">
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    {/* Father Name */}
                    <div className="w-3/12">
                        <Label>Father Name</Label>
                        <Input
                            value={data.father_name}
                            onChange={(e) => setData('father_name', e.target.value)}
                        />
                        {errors.father_name && <div className="text-red-500">{errors.father_name}</div>}
                    </div>

                    {/* Mother Name */}
                    <div className="w-3/12">
                        <Label>Mother Name</Label>
                        <Input
                            value={data.mother_name}
                            onChange={(e) => setData('mother_name', e.target.value)}
                        />
                        {errors.mother_name && <div className="text-red-500">{errors.mother_name}</div>}
                    </div>

                    {/* UID */}
                    <div className="w-3/12">
                        <Label>Student UID</Label>
                        <Input
                            value={data.student_uid || ''}
                            onChange={(e) => setData('student_uid', e.target.value)}
                        />
                        {errors.student_uid && <div className="text-red-500">{errors.student_uid}</div>}
                    </div>

                    {/* Phone */}
                    <div className="w-3/12">
                        <Label>Phone</Label>
                        <Input
                            value={data.phone || ''}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        {errors.phone && <div className="text-red-500">{errors.phone}</div>}
                    </div>

                    {/* Email */}
                    <div className="w-3/12">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </div>

                    {/* Photo */}
                    <div className="w-3/12">
                        <Label>Photo</Label>
                        <Input
                            type="file"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files?.[0]) {
                                    setData('photo', e.target.files[0]);
                                }
                            }}
                        />
                        {errors.photo && <div className="text-red-500">{errors.photo}</div>}
                    </div>

                    {/* Address */}
                    <div className="w-3/12">
                        <Label>Address</Label>
                        <textarea
                            value={data.address || ''}
                            onChange={(e) => setData('address', e.target.value)}
                            className="border p-2 w-full rounded"
                        />
                        {errors.address && <div className="text-red-500">{errors.address}</div>}
                    </div>

                    {/* Guardian */}
                    <div className="w-3/12">
                        <Label>Guardian Name</Label>
                        <Input
                            value={data.guardian_name || ''}
                            onChange={(e) => setData('guardian_name', e.target.value)}
                        />
                        {errors.guardian_name && <div className="text-red-500">{errors.guardian_name}</div>}
                    </div>

                    <div className="w-3/12">
                        <Label>Guardian Phone</Label>
                        <Input
                            value={data.guardian_phone || ''}
                            onChange={(e) => setData('guardian_phone', e.target.value)}
                        />
                        {errors.guardian_phone && <div className="text-red-500">{errors.guardian_phone}</div>}
                    </div>

                    <div className="w-3/12">
                        <Label>Guardian Relation</Label>
                        <Input
                            value={data.guardian_relation || ''}
                            onChange={(e) => setData('guardian_relation', e.target.value)}
                        />
                        {errors.guardian_relation && <div className="text-red-500">{errors.guardian_relation}</div>}
                    </div>

                    {/* Status */}
                    <div className="w-3/12">
                        <Label>Status</Label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                            className="border p-2 rounded w-full"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && <div className="text-red-500">{errors.status}</div>}
                    </div>

                    {/* Batch */}
                    <div className="w-3/12">
                        <Label>Batch</Label>
                        <select
                            className="border p-2 rounded w-full"
                            value={data.batch_id || ''}
                            onChange={(e) => setData('batch_id', e.target.value)}
                        >
                            <option value="">Select The Batch</option>
                            {batches.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                        {errors.batch_id && <div className="text-red-500">{errors.batch_id}</div>}
                    </div>

                    {/* Courses */}
                    <div className="w-3/12">
                        <Label>Courses : </Label>
                        <div className="flex flex-col gap-2 border p-2 rounded">

                            {courses.map((course) => {
                                const courseId = Number(course.id);
                                return (
                                    <label key={course.id} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={course.id}
                                            checked={data.course_ids.includes(courseId)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData('course_ids', [...data.course_ids, courseId]);
                                                } else {
                                                    setData(
                                                        'course_ids',
                                                        data.course_ids.filter((id) => id !== courseId)
                                                    );
                                                }
                                            }}
                                        />
                                        {course.name}
                                    </label>
                                );
                            })}

                        </div>

                        {errors.course_ids && (
                            <div className="text-red-500">{errors.course_ids}</div>
                        )}
                    </div>

                    <div className="w-3/12">
                        <Button type="submit">Update Student</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
