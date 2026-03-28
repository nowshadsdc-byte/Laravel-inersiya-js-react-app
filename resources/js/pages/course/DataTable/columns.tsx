import { CourseDailog } from '@/components/course-dailog';
import { Button } from '@/components/ui/button';
import { courseEditConfig } from '@/config/courseConfig/course-edit-config';
import { Course } from '@/types/Course';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Course Name',
    },

    {
        accessorKey: 'course_code',
        header: 'Course Code',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'students_count',
        header: 'Enrolled Students',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const course = row.original;
            return (
                <div className="flex gap-2">
                    {/* Student Profile */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.get(`/course/show/${course.id}`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>

                    <CourseDailog
                        coursesdata={course}
                        ButtonLabel={courseEditConfig.ButtonLabel}
                        title={courseEditConfig.title}
                        description={courseEditConfig.description}
                    />

                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            if (
                                confirm(
                                    'Are you sure you want to delete this course?',
                                )
                            ) {
                                router.delete(`/courses/${course.id}`);
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
