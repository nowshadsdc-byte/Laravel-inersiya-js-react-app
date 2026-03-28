'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getGlobalFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getGlobalFilteredRowModel: getGlobalFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full space-y-4">
            {/* Top Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2">
                <div className="text-sm text-muted-foreground">
                    Total Records:{' '}
                    {table.getPrePaginationRowModel().rows.length}
                </div>

                <div className="flex gap-2">
                    {/* Global Search */}
                    <Input
                        placeholder="Search everything..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-xs"
                    />

                    {/* Status Dropdown Filter (example) */}
                    {table.getColumn('status') && (
                        <select
                            className="rounded border px-2 py-1 text-sm"
                            value={
                                (table
                                    .getColumn('status')
                                    ?.getFilterValue() as string) ?? ''
                            }
                            onChange={(e) =>
                                table
                                    .getColumn('status')
                                    ?.setFilterValue(
                                        e.target.value || undefined,
                                    )
                            }
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="called">Called</option>
                            <option value="converted">Converted</option>
                        </select>
                    )}

                    {/* Reset */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setGlobalFilter('');
                            setColumnFilters([]);
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div className="space-y-1">
                                                {/* Header */}
                                                <div
                                                    className="cursor-pointer select-none"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: ' ↑',
                                                        desc: ' ↓',
                                                    }[
                                                        header.column.getIsSorted() as string
                                                    ] ?? null}
                                                </div>

                                                {/* Column Filter */}
                                                {header.column.getCanFilter() && (
                                                    <Input
                                                        value={
                                                            (header.column.getFilterValue() as string) ??
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            header.column.setFilterValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Filter..."
                                                        className="h-8"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
