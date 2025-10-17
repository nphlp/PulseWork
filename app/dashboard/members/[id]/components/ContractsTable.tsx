"use client";

import { Contract, DayOfWeek, Schedule, Work } from "@prisma/client";
import { cn } from "@shadcn/lib/utils";
import { Badge } from "@shadcn/ui/badge";
import { Button } from "@shadcn/ui/button";
import { Card } from "@shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import {
    ColumnDef,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Fragment, useState } from "react";

type ContractWithRelations = Contract & {
    Schedules: (Schedule & {
        Works: Work[];
    })[];
};

type ContractsTableProps = {
    contracts: ContractWithRelations[];
};

// Définition des colonnes du tableau de contrats
const columns: ColumnDef<ContractWithRelations>[] = [
    {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
            return row.original.Schedules.length > 0 ? (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => row.toggleExpanded()}
                    className="p-0 hover:bg-transparent"
                >
                    {row.getIsExpanded() ? (
                        <ChevronDownIcon className="size-4" />
                    ) : (
                        <ChevronRightIcon className="size-4" />
                    )}
                </Button>
            ) : null;
        },
        size: 40,
    },
    {
        header: "Contract Type",
        accessorKey: "contractType",
        cell: ({ row }) => {
            const type = row.getValue("contractType") as string;
            return (
                <Badge
                    className={cn(
                        type === "CDI" && "text-primary-foreground bg-green-500/80",
                        type === "CDD" && "text-primary-foreground bg-blue-500/80",
                        type === "INTERIM" && "text-primary-foreground bg-orange-500/80",
                        type === "STAGE" && "text-primary-foreground bg-purple-500/80",
                    )}
                >
                    {type}
                </Badge>
            );
        },
        size: 150,
    },
    {
        header: "Start Date",
        accessorKey: "startDate",
        cell: ({ row }) => {
            const date = new Date(row.getValue("startDate"));
            return date.toLocaleDateString("fr-FR");
        },
        size: 120,
    },
    {
        header: "End Date",
        accessorKey: "endDate",
        cell: ({ row }) => {
            const date = row.getValue("endDate") as Date | null;
            return date ? new Date(date).toLocaleDateString("fr-FR") : <span className="text-muted-foreground">-</span>;
        },
        size: 120,
    },
    {
        header: "Status",
        cell: ({ row }) => {
            const endDate = row.original.endDate;
            const isActive = !endDate || new Date(endDate) > new Date();
            return (
                <Badge variant={isActive ? "default" : "outline"} className={isActive ? "bg-green-600" : ""}>
                    {isActive ? "Active" : "Terminated"}
                </Badge>
            );
        },
        size: 120,
    },
    {
        header: "Schedules",
        cell: ({ row }) => {
            const count = row.original.Schedules.length;
            return (
                <div className="text-muted-foreground text-sm">
                    {count} schedule{count !== 1 ? "s" : ""}
                </div>
            );
        },
        size: 100,
    },
];

export default function ContractsTable({ contracts }: ContractsTableProps) {
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const table = useReactTable({
        data: contracts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        state: {
            expanded,
        },
    });

    return (
        <div className="space-y-4">
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
                                <Fragment key={row.id}>
                                    {/* Row principale du contrat */}
                                    <TableRow>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {/* Row expansée avec les schedules */}
                                    {row.getIsExpanded() && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="bg-muted/50 p-4">
                                                <SchedulesSubTable schedules={row.original.Schedules} />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No contracts found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

// Sous-composant pour afficher les schedules d'un contrat
type SchedulesSubTableProps = {
    schedules: ContractWithRelations["Schedules"];
};

function SchedulesSubTable({ schedules }: SchedulesSubTableProps) {
    const dayOrder: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

    const dayTranslations: Record<DayOfWeek, string> = {
        MONDAY: "Lundi",
        TUESDAY: "Mardi",
        WEDNESDAY: "Mercredi",
        THURSDAY: "Jeudi",
        FRIDAY: "Vendredi",
        SATURDAY: "Samedi",
        SUNDAY: "Dimanche",
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold">Schedules & Working Hours</h3>
            {schedules.length === 0 ? (
                <p className="text-muted-foreground text-sm">No schedules defined for this contract.</p>
            ) : (
                <div className="space-y-4">
                    {schedules.map((schedule) => {
                        // Grouper les Works par jour
                        const worksByDay = schedule.Works.reduce(
                            (acc, work) => {
                                if (!acc[work.arrivingDay]) {
                                    acc[work.arrivingDay] = [];
                                }
                                acc[work.arrivingDay].push(work);
                                return acc;
                            },
                            {} as Record<DayOfWeek, Work[]>,
                        );

                        // Trier les jours dans l'ordre
                        const sortedDays = dayOrder
                            .filter((day) => worksByDay[day])
                            .map((day) => ({
                                day,
                                works: worksByDay[day].sort((a, b) => a.arriving.localeCompare(b.arriving)),
                            }));

                        return (
                            <Card key={schedule.id} className="p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="text-sm">
                                        <span className="font-medium">Period: </span>
                                        <span className="text-muted-foreground">
                                            {new Date(schedule.startDate).toLocaleDateString("fr-FR")}
                                            {" - "}
                                            {schedule.endDate ? (
                                                new Date(schedule.endDate).toLocaleDateString("fr-FR")
                                            ) : (
                                                <span className="text-foreground font-medium">Ongoing</span>
                                            )}
                                        </span>
                                    </div>
                                    <Badge variant="outline">{sortedDays.length} working days</Badge>
                                </div>

                                <div className="overflow-hidden rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="w-32">Day</TableHead>
                                                <TableHead>Periods</TableHead>
                                                <TableHead>Work Hours</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sortedDays.map(({ day, works }) => {
                                                // Calculer les heures de travail totales pour le jour
                                                const totalMinutes = works.reduce((total, work) => {
                                                    const [arrHours, arrMin] = work.arriving.split(":").map(Number);
                                                    const [depHours, depMin] = work.leaving.split(":").map(Number);
                                                    const periodMinutes =
                                                        depHours * 60 + depMin - (arrHours * 60 + arrMin);
                                                    return total + periodMinutes;
                                                }, 0);
                                                const workHours = Math.floor(totalMinutes / 60);
                                                const workMinutes = totalMinutes % 60;

                                                return (
                                                    <TableRow key={day}>
                                                        <TableCell className="font-medium">
                                                            {dayTranslations[day]}
                                                        </TableCell>
                                                        <TableCell>
                                                            {works.map((work, idx) => (
                                                                <div key={idx} className="text-sm">
                                                                    {work.arriving} - {work.leaving}
                                                                </div>
                                                            ))}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {workHours}h{workMinutes > 0 ? ` ${workMinutes}min` : ""}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
