"use client";

import { cn } from "@shadcn/lib/utils";
import { Badge } from "@shadcn/ui/badge";
import { Button } from "@shadcn/ui/button";
import { Checkbox } from "@shadcn/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@shadcn/ui/dropdown-menu";
import { Input } from "@shadcn/ui/input";
import { Label } from "@shadcn/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@shadcn/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shadcn/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    PaginationState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronDownIcon,
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CircleXIcon,
    Columns3Icon,
    EllipsisIcon,
    FilterIcon,
    ListFilterIcon,
    UserPlusIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

// Type pour un employé avec ses relations
type Employee = {
    id: string;
    name: string;
    lastname: string | null;
    email: string;
    role: "ADMIN" | "MANAGER" | "EMPLOYEE";
    Contracts: Array<{
        id: string;
        contractType: "CDI" | "CDD" | "INTERIM" | "STAGE";
        startDate: Date;
        endDate: Date | null;
    }>;
};

// Fonction de filtrage multi-colonnes pour nom/prénom/email
const multiColumnFilterFn: FilterFn<Employee> = (row, _columnId, filterValue) => {
    const searchableRowContent =
        `${row.original.name} ${row.original.lastname ?? ""} ${row.original.email}`.toLowerCase();
    const searchTerm = (filterValue ?? "").toLowerCase();
    return searchableRowContent.includes(searchTerm);
};

// Fonction de filtrage par rôle
const roleFilterFn: FilterFn<Employee> = (row, _columnId, filterValue: string[]) => {
    if (!filterValue?.length) return true;
    const role = row.getValue("role") as string;
    return filterValue.includes(role);
};

// Définition des colonnes
const columns: ColumnDef<Employee>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.getValue("name")} {row.original.lastname}
            </div>
        ),
        size: 180,
        filterFn: multiColumnFilterFn,
        enableHiding: false,
    },
    {
        header: "Email",
        accessorKey: "email",
        size: 220,
    },
    {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            return (
                <Badge
                    className={cn(
                        role === "ADMIN" && "text-primary-foreground bg-red-500/80",
                        role === "MANAGER" && "text-primary-foreground bg-blue-500/80",
                        role === "EMPLOYEE" && "text-primary-foreground bg-green-500/80",
                    )}
                >
                    {role}
                </Badge>
            );
        },
        size: 120,
        filterFn: roleFilterFn,
    },
    {
        header: "Contract",
        accessorKey: "Contracts",
        cell: ({ row }) => {
            const contracts = row.original.Contracts;
            // Trouver le contrat actif (celui sans endDate ou avec endDate dans le futur)
            const activeContract = contracts.find((c) => !c.endDate || new Date(c.endDate) > new Date());
            return activeContract ? (
                <Badge variant="outline">{activeContract.contractType}</Badge>
            ) : (
                <span className="text-muted-foreground text-sm">No contract</span>
            );
        },
        size: 120,
        enableSorting: false,
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} />,
        size: 60,
        enableHiding: false,
    },
];

type EmployeesTableProps = {
    employees: Employee[];
};

export default function EmployeesTable({ employees }: EmployeesTableProps) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const inputRef = useRef<HTMLInputElement>(null);

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "name",
            desc: false,
        },
    ]);

    const table = useReactTable({
        data: employees,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            pagination,
            columnFilters,
            columnVisibility,
        },
    });

    // Get unique role values
    const uniqueRoleValues = useMemo(() => {
        const roleColumn = table.getColumn("role");
        if (!roleColumn) return [];
        const values = Array.from(roleColumn.getFacetedUniqueValues().keys());
        return values.sort();
        // eslint-disable-next-line
    }, [table.getColumn("role")?.getFacetedUniqueValues()]);

    // Get counts for each role
    const roleCounts = useMemo(() => {
        const roleColumn = table.getColumn("role");
        if (!roleColumn) return new Map();
        return roleColumn.getFacetedUniqueValues();
        // eslint-disable-next-line
    }, [table.getColumn("role")?.getFacetedUniqueValues()]);

    const selectedRoles = useMemo(() => {
        const filterValue = table.getColumn("role")?.getFilterValue() as string[];
        return filterValue ?? [];
        // eslint-disable-next-line
    }, [table.getColumn("role")?.getFilterValue()]);

    const handleRoleChange = (checked: boolean, value: string) => {
        const filterValue = table.getColumn("role")?.getFilterValue() as string[];
        const newFilterValue = filterValue ? [...filterValue] : [];

        if (checked) {
            newFilterValue.push(value);
        } else {
            const index = newFilterValue.indexOf(value);
            if (index > -1) {
                newFilterValue.splice(index, 1);
            }
        }

        table.getColumn("role")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {/* Filter by name or email */}
                    <div className="relative">
                        <Input
                            ref={inputRef}
                            className={cn(
                                "peer min-w-60 ps-9",
                                Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9",
                            )}
                            value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
                            onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
                            placeholder="Filter by name or email..."
                            type="text"
                            aria-label="Filter by name or email"
                        />
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                            <ListFilterIcon size={16} aria-hidden="true" />
                        </div>
                        {Boolean(table.getColumn("name")?.getFilterValue()) && (
                            <button
                                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Clear filter"
                                onClick={() => {
                                    table.getColumn("name")?.setFilterValue("");
                                    if (inputRef.current) {
                                        inputRef.current.focus();
                                    }
                                }}
                            >
                                <CircleXIcon size={16} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    {/* Filter by role */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                Role
                                {selectedRoles.length > 0 && (
                                    <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                                        {selectedRoles.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto min-w-36 p-3" align="start">
                            <div className="space-y-3">
                                <div className="text-muted-foreground text-xs font-medium">Filter by role</div>
                                <div className="space-y-3">
                                    {uniqueRoleValues.map((value, i) => (
                                        <div key={value} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`role-${i}`}
                                                checked={selectedRoles.includes(value)}
                                                onCheckedChange={(checked: boolean) => handleRoleChange(checked, value)}
                                            />
                                            <Label
                                                htmlFor={`role-${i}`}
                                                className="flex grow justify-between gap-2 font-normal"
                                            >
                                                {value}{" "}
                                                <span className="text-muted-foreground ms-2 text-xs">
                                                    {roleCounts.get(value)}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {/* Toggle columns visibility */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            onSelect={(event) => event.preventDefault()}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center gap-3">
                    {/* Add employee button */}
                    <Button className="ml-auto" variant="outline">
                        <UserPlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                        Add employee
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-background overflow-hidden rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: `${header.getSize()}px` }}
                                            className="h-11"
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <div
                                                    className={cn(
                                                        header.column.getCanSort() &&
                                                            "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key === "Enter" || e.key === " ")
                                                        ) {
                                                            e.preventDefault();
                                                            header.column.getToggleSortingHandler()?.(e);
                                                        }
                                                    }}
                                                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: (
                                                            <ChevronUpIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                        desc: (
                                                            <ChevronDownIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="last:py-0">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No employees found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-8">
                {/* Results per page */}
                <div className="flex items-center gap-3">
                    <Label htmlFor="page-size" className="max-sm:sr-only">
                        Rows per page
                    </Label>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger id="page-size" className="w-fit whitespace-nowrap">
                            <SelectValue placeholder="Select number of results" />
                        </SelectTrigger>
                        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                            {[10, 25, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Page number information */}
                <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
                    <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
                        <span className="text-foreground">
                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                            {Math.min(
                                Math.max(
                                    table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                                        table.getState().pagination.pageSize,
                                    0,
                                ),
                                table.getRowCount(),
                            )}
                        </span>{" "}
                        of <span className="text-foreground">{table.getRowCount().toString()}</span>
                    </p>
                </div>

                {/* Pagination buttons */}
                <div>
                    <Pagination>
                        <PaginationContent>
                            {/* First page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to first page"
                                >
                                    <ChevronFirstIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Previous page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to previous page"
                                >
                                    <ChevronLeftIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Next page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to next page"
                                >
                                    <ChevronRightIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Last page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to last page"
                                >
                                    <ChevronLastIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

// Component for row actions
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RowActions({ row }: { row: Row<Employee> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-end">
                    <Button size="icon" variant="ghost" className="shadow-none" aria-label="Actions">
                        <EllipsisIcon size={16} aria-hidden="true" />
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Edit employee</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
