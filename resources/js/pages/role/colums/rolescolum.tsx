import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Role } from "@/types"
export const rolescolum: ColumnDef<Role>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Role Name",
    },
    {
        accessorKey: "guard_name",
        header: "Guard Name",
    },
    {
        accessorKey: "permissions",
        header: "permissions",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const role = row.original
            return (
                <div className="flex gap-2">
                    {/* View Batch */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.get(`batch/show/${role.id}`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {/* Edit */}
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.get(`/role/edit/${role.id}`)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    {/* Delete */}
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this batch?")) {
                                router.delete(`/role/delete/${role.id}`)
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
