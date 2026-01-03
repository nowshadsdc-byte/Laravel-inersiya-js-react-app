import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 ,Eye} from "lucide-react"
import { Student } from "@/types/Students"

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Student Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "batch_id",
        header: "Batch Name",
        cell: ({ row }) => row.original.batch?.name ?? "—",
    },
    {
        header: "Courses",
        cell: ({ row }) => {
            const courses = row.original.courses

            if (!courses || courses.length === 0) {
                return <span className="text-muted-foreground">No Course</span>
            }

            return (
                <div className="flex flex-wrap gap-1">
                    {courses.map(course => (
                        <span
                            key={course.id}
                            className="rounded bg-slate-100 px-2 py-1 text-xs"
                        >
                            {course.name}
                        </span>
                    ))}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const student = row.original

            return (
                <div className="flex gap-2">
                    {/* Student Profile */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.get(`/student/profile/${student.id}`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {/* Edit */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.get(`/student/edit/${student.id}`)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this student?")) {
                                router.delete(`/student/${student.id}`)
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]
