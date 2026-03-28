import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { BatchFormData } from '@/types/Batch';
import { Button } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
export default function Create({
    courses,
}: {
    courses: { id: number; name: string }[];
}) {
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/batch/create');
    }
    const { data, setData, post, processing, errors } = useForm<
        BatchFormData & { general?: string }
    >({
        name: '',
        course_id: 0,
        batch_code: ' ',
        start_date: '',
        end_date: '',
        batch_status: 'pending',
        TotalClass: 0,
    });
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Batches Create',
            href: dashboard().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Dashboard" />
            <div className="p-6">
                <form
                    onSubmit={submit}
                    method="post"
                    className="max-w-lg space-y-4"
                >
                    <div className="flex flex-col">
                        <div>
                            <Label>Batch Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="my-4">
                            <Label>start_date</Label>
                            <Input
                                type="date"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData('start_date', e.target.value)
                                }
                            />
                            {errors.start_date && (
                                <p className="text-sm text-red-500">
                                    {errors.start_date}
                                </p>
                            )}
                        </div>

                        <div className="my-4">
                            <Label>end_date</Label>
                            <Input
                                type="date"
                                value={data.end_date}
                                onChange={(e) =>
                                    setData('end_date', e.target.value)
                                }
                            />
                            {errors.end_date && (
                                <p className="text-sm text-red-500">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>
                        <div className="my-4">
                            <Label>batch_code</Label>
                            <Input
                                type="text"
                                value={data.batch_code}
                                onChange={(e) =>
                                    setData('batch_code', e.target.value)
                                }
                            />
                            {errors.end_date && (
                                <p className="text-sm text-red-500">
                                    {errors.end_date}
                                </p>
                            )}
                        </div>

                        <div className="my-4">
                            <Label>TotalClass</Label>
                            <Input
                                type="number"
                                value={data.TotalClass}
                                onChange={(e) =>
                                    setData(
                                        'TotalClass',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : 0,
                                    )
                                }
                            />
                            {errors.TotalClass && (
                                <p className="text-sm text-red-500">
                                    {errors.TotalClass}
                                </p>
                            )}
                        </div>
                        <div className="my-4">
                            <Label>Course</Label>
                            <select
                                value={data.course_id}
                                onChange={(e) =>
                                    setData(
                                        'course_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : 0,
                                    )
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Batch Status</Label>
                            <select
                                value={data.batch_status}
                                onChange={(e) =>
                                    setData('batch_status', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Upcoming</option>
                            </select>   
                        </div>
                        <Button
                            disabled={processing}
                            className="btn mx-6 my-6 rounded-md px-3 py-3 outline-1 outline-blue-950"
                            type="submit"
                        >
                            {processing ? 'Saving...' : 'Save Batch'}
                        </Button>
                        {errors.general && (
                            <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                                {errors.general}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
