import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Course } from '@/types/Course';

import { Form, Head, useForm } from '@inertiajs/react';

export default function Create() {

    function submitCourse(e: React.FormEvent) {
        e.preventDefault();
        post("/courses/create");
    }
    const { data, setData, post, processing, errors } = useForm<Course>({
        id: 0,
        name: "",
        description: null,
    })
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Courses Create',
            href: dashboard().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Dashboard" />
            <div className="p-6">
                <Form onSubmit={submitCourse} method='post' className="max-w-lg space-y-4">
                    <div className="flex flex-col">
                        <div>
                            <Label>Course Name</Label>
                            <Input type="text" value={data.name} name="name" className="border rounded px-3 py-2 w-full" onChange={(e) => setData('name', (e.target as HTMLInputElement).value)} />
                        </div>
                        <div>
                            <Label>Course Description</Label>
                            <Input type="text" value={data.description ?? ""} onChange={(e) => setData('description', (e.target as HTMLInputElement).value)} name="description" className="border rounded px-3 py-2 w-full" />
                        </div>
                        <div>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Course'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}
