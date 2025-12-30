import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Course } from "@/types/Course"
import { useForm } from "@inertiajs/react"
import { useEffect } from "react"

type CourseDialogProps = {
  ButtonLabel: string
  title: string
  description: string
  coursesdata: Course
}

export function CourseDailog({
  coursesdata,
  ButtonLabel,
  title,
  description,
}: CourseDialogProps) {

  const { data, setData, put, processing } = useForm({
    name: "",
    description: "",
  })

  useEffect(() => {
    setData({
      name: coursesdata.name ?? "",
      description: coursesdata.description ?? "",
    })
  }, [coursesdata])

  function update(e: React.FormEvent) {
    e.preventDefault()
    put(`/courses/edit/${coursesdata.id}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{ButtonLabel}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={update}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
          </div>

          <div className="grid gap-4 mt-4">
            <Label>Course Description</Label>
            <Input
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
            />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={processing}>
              {processing ? "Updating..." : "Update Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
