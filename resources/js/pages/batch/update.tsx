import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type Batch = Record<string, any>;

interface Props {
    batch: Batch;
    courses: { id: number; name: string }[];
    error?: string;
}

export default function Update({ batch, courses, error }: Props) {
    const { data, setData, put, processing, errors } = useForm<
        Record<string, any>
    >({
        ...batch,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Batches / Update', href: dashboard().url },
    ];

    const formFields = [
        'name',
        'start_date',
        'end_date',
        'TotalClass',
        'batch_code',
        'batch_status',
    ];

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/batch/edit/${batch.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Batch" />

            {error && (
                <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="max-w-lg p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    Update Batch: {batch.name}
                </h1>

                <form onSubmit={submit} className="space-y-4">
                    <input type="hidden" name="_method" value="PUT" />

                    {formFields.map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 capitalize">
                                {field.replace('_', ' ')}
                            </label>

                            {field === 'batch_status' ? (
                                <select
                                    value={data[field] ?? ''}
                                    onChange={(e) => {
                                        setData((prev: Record<string, any>) => ({
                                            ...prev,
                                            [field]: e.target.value,
                                        }));
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                >
                                    <option value={`${data[field] ?? ''}`}>{data[field] ?? ''}</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                            ) : (
                                <input
                                    type={
                                        field.includes('date')
                                            ? 'date'
                                            : field === 'TotalClass'
                                                ? 'number'
                                                : 'text'
                                    }
                                    value={data[field] ?? ''}
                                    onChange={(e) => {
                                        const value =
                                            field === 'TotalClass'
                                                ? Number(e.target.value)
                                                : e.target.value;

                                        setData((prev: Record<string, any>) => ({
                                            ...prev,
                                            [field]: value,
                                        }));
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                />
                            )}

                            {errors[field] && (
                                <p className="text-sm text-red-500">
                                    {errors[field]}
                                </p>
                            )}
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Course
                        </label>
                        <select
                            value={data.course_id ?? ''}
                            onChange={(e) =>
                                setData((prev: Record<string, any>) => ({
                                    ...prev,
                                    course_id: Number(e.target.value),
                                }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                        >
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>

                        {errors.course_id && (
                            <p className="text-sm text-red-500">
                                {errors.course_id}
                            </p>
                        )}
                    </div>


                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            {processing ? 'Updating...' : 'Update Batch'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
