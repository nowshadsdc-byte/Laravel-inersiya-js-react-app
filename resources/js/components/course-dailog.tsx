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
import { Label  } from "@/components/ui/label"
import { Course } from "@/types/Course"

type CourseDialogProps = {
  id: number | string,
  ButtonLabel: string ,
  title: string,
  description: string,
  coursesdata:Course
}
 

export function CourseDailog({ id , coursesdata, ButtonLabel ,title , description}: CourseDialogProps) {
  function sumit(){
  
  }
  return (
    <Dialog>
      <form onSubmit={sumit}>
        <DialogTrigger asChild>
          <Button variant="outline">{ButtonLabel} </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description} 
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
                <Label>Name</Label>
                <Input type="text" name="name" value={coursesdata.name} ></Input>
          </div>
          <div className="grid gap-4">
                <Label>Description </Label>
                <Input className="" value={coursesdata.id}></Input>
          </div>

          <div className="grid gap-4">
                <Label>Description </Label>
                <Input className="" ></Input>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
