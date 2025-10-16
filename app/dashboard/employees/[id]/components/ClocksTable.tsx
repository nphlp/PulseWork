"use client";

import { cn } from "@shadcn/lib/utils";
import { Badge } from "@shadcn/ui/badge";
import { Card } from "@shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ClockIcon } from "lucide-react";

type Clock = {
    id: string;
    date: Date;
    checkType: "CHECKIN" | "CHECKOUT";
    createdAt: Date;
    updatedAt: Date;
};

type ClocksTableProps = {
    clocks: Clock[];
};

// Définition des colonnes du tableau de pointages
const columns: ColumnDef<Clock>[] = [
    {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("date"));
            return (
                <div className="font-medium">
                    {date.toLocaleDateString("fr-FR", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            );
        },
        size: 200,
    },
    {
        header: "Type",
        accessorKey: "checkType",
        cell: ({ row }) => {
            const type = row.getValue("checkType") as string;
            return (
                <Badge
                    className={cn(
                        type === "CHECKIN" && "text-primary-foreground bg-green-500/80",
                        type === "CHECKOUT" && "text-primary-foreground bg-blue-500/80",
                    )}
                >
                    {type === "CHECKIN" ? "Check In" : "Check Out"}
                </Badge>
            );
        },
        size: 120,
    },
    {
        header: "Time",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="flex items-center gap-2">
                    <ClockIcon className="text-muted-foreground size-4" />
                    <span>
                        {date.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            );
        },
        size: 120,
    },
];

export default function ClocksTable({ clocks }: ClocksTableProps) {
    const table = useReactTable({
        data: clocks,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="overflow-hidden">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No clock entries found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
