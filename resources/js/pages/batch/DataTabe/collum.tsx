import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Batch } from "@/types/Batch"


export const columns: ColumnDef<Batch>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Batch Name",
  },
  {
    accessorKey: "batch_code",
    header: "Batch Code",
  },
  {
    accessorKey: "course.name",
    header: "Course Name",
  },
  {
    accessorKey: "TotalClass",
    header: "Total Class",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) =>
      row.getValue("start_date")
        ? new Date(row.getValue("start_date")).toLocaleDateString()
        : "—",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const batch = row.original

      return (
        <div className="flex gap-2">
          {/* View Batch */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => router.get(`batch/show/${batch.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Edit */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => router.get(`/batch/${batch.id}/edit`)}
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
