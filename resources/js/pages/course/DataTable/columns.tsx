import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Course } from "@/types/Course"
import { CourseDailog } from "@/components/course-dailog"
import { courseEditConfig } from "@/config/courseConfig/course-edit-config"

export const columns: ColumnDef<Course>[] = [
  {
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
      const course = row.original
      return (
        <div className="flex gap-2">

          <CourseDailog coursesdata={course} ButtonLabel={courseEditConfig.ButtonLabel} title={courseEditConfig.title}  description={courseEditConfig.description}/>

          <Button
            size="icon"
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this course?")) {
                router.delete(`/courses/${course.id}`)
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
