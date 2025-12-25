import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { Course } from "@/types/Course"

export const columns: ColumnDef<Course>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Course Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const batch = row.original
      return (
        <div className="flex gap-2">
          {/* Edit */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => router.get(`/course/${batch.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete */}
          <Button
            size="icon"
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this batch?")) {
                router.delete(`/batch/${batch.id}`)
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
