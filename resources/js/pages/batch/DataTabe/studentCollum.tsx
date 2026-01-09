import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye } from "lucide-react"
import { Student } from "@/types/Students"

export const studentCollum: ColumnDef<Student>[] = [
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
    }, {
        accessorKey: "student_uid",
        header: "student_uid"
    }
    ,
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
