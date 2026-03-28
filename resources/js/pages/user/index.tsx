import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './DataTabe/colums';

export default function Index({ users }: { users: User[] }) {
    return (
        <AppLayout>
            <Head title="Website Users" />
            <div className="flex w-[100%] items-center justify-between">
                <Button
                    onClick={() => router.get('/users/create')}
                    className="mx-6 my-6 w-3/12"
                >
                    Add New User
                </Button>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
                <DataTable
                    columns={columns}
                    data={users}
                    searchKey="name"
                ></DataTable>
            </div>
        </AppLayout>
    );
}
