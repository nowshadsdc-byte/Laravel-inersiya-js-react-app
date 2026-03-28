import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Course } from '@/types/Course';
import { Head, useForm } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: dashboard().url,
    },
];
export default function Index() {
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/courses/create');
    }

    const { data, setData, post, processing, errors } = useForm<Course>({
        id: '',
        name: '',
        course_code: '',
        description: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Dashboard" />
            <div className="m-6 w-4/12 p-6">
                <form onSubmit={submit}>
                    <div className="p-4">
                        <Label>Course Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="name"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>
                    <div className="p-4">
                        <Label>Course Code</Label>
                        <Input
                            value={data.course_code}
                            onChange={(e) =>
                                setData('course_code', e.target.value)
                            }
                            placeholder="course code"
                        />
                        {errors.course_code && (
                            <p className="text-sm text-red-500">
                                {errors.course_code}
                            </p>
                        )}
                    </div>
                    <div className="p-4">
                        <Label>Course Description</Label>
                        <Input
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            placeholder="course description"
                        />

                        {errors.description && (
                            <p className="text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="p-6">
                        {processing ? 'Saving...' : 'Save Course'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
