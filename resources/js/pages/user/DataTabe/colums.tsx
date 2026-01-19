import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { User } from "@/types"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "User Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            const users = row.original
            return (
                <div>
                    {users.roles?.map((role) => (
                        <span key={role.id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 rounded-full mr-1">
                            {role.name}
                        </span>
                    ))}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const users = row.original

            return (
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                                router.get(`/users/edit/${users.id}`)
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>                  
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this student?")) {
                                router.delete(`/user/delete/${users.id}`)
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
