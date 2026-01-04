import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { BatchFormData } from '@/types/Batch';
import { Button } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
export default function Create({ courses }: { courses: { id: number; name: string }[] }) {
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post("/batch/create");
    }
    const { data, setData, post, processing, errors } = useForm<BatchFormData>({
        name: "",
        course_id: 0,
        batch_code:2024,
        start_date: "",
        end_date: "",
        TotalClass: 60,

    })
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
                <form onSubmit={submit} method='post' className="max-w-lg space-y-4" >
                    <div className="flex flex-col">
                        <div>
                            <Label>Batch Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        <div className="my-4">
                            <Label>start_date</Label>
                            <Input type='date'
                                value={data.start_date}
                                onChange={(e) => setData("start_date", e.target.value)}
                            />
                            {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date}</p>}
                        </div>

                        <div className="my-4">
                            <Label>end_date</Label>
                            <Input type='date'
                                value={data.end_date}
                                onChange={(e) => setData("end_date", e.target.value)}
                            />
                            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
                        </div>
                        <div className="my-4">
                            <Label>batch_code</Label>
                            <Input type='number'
                                value={data.batch_code}
                                onChange={(e) => setData("batch_code",Number(e.target.value))}
                            />
                            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
                        </div>

                        <div className="my-4">
                            <Label>TotalClass</Label>
                            <Input type='number'
                                value={data.TotalClass}
                                onChange={(e) => setData("TotalClass", e.target.value ? Number(e.target.value) : 0)}
                            />
                            {errors.TotalClass && <p className="text-red-500 text-sm">{errors.TotalClass}</p>}
                        </div>
                        <div className="my-4">
                            <Label>Course</Label>
                            <select
                                value={data.course_id}
                                onChange={(e) => setData("course_id", e.target.value ? Number(e.target.value) : 0)}
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button disabled={processing} className="btn outline-1 outline-blue-950 mx-6 my-6 py-3 px-3 rounded-md" type="submit">
                            {processing ? "Saving..." : "Save Batch"}
                        </Button>

                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
