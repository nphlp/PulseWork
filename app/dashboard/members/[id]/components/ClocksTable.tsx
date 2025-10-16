"use client";

import { cn } from "@shadcn/lib/utils";
import { Badge } from "@shadcn/ui/badge";
import { Card } from "@shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AlertCircleIcon, CheckCircleIcon, ClockIcon } from "lucide-react";

type Day = {
    id: string;
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    arriving: string;
    leaving: string;
    breack: number | null;
};

type Schedule = {
    id: string;
    startDate: Date;
    endDate: Date | null;
    Days: Day[];
};

type Contract = {
    id: string;
    contractType: "CDI" | "CDD" | "INTERIM" | "STAGE";
    startDate: Date;
    endDate: Date | null;
    Schedules: Schedule[];
};

type Clock = {
    id: string;
    date: Date;
    checkType: "CHECKIN" | "CHECKOUT";
    createdAt: Date;
    updatedAt: Date;
};

type ClocksTableProps = {
    clocks: Clock[];
    contracts: Contract[];
};

// Helper: Trouve le contrat et schedule actifs à une date donnée
function findActiveSchedule(contracts: Contract[], clockDate: Date) {
    for (const contract of contracts) {
        const contractStart = new Date(contract.startDate);
        const contractEnd = contract.endDate ? new Date(contract.endDate) : null;

        // Vérifier si le contrat était actif à cette date
        if (contractStart <= clockDate && (!contractEnd || contractEnd >= clockDate)) {
            // Trouver le schedule actif dans ce contrat
            for (const schedule of contract.Schedules) {
                const scheduleStart = new Date(schedule.startDate);
                const scheduleEnd = schedule.endDate ? new Date(schedule.endDate) : null;

                if (scheduleStart <= clockDate && (!scheduleEnd || scheduleEnd >= clockDate)) {
                    return { contract, schedule };
                }
            }
        }
    }
    return null;
}

// Helper: Trouve le Day configuré pour un jour de la semaine
function findDayConfig(schedule: Schedule, clockDate: Date): Day | null {
    const dayNames = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const dayOfWeek = dayNames[clockDate.getDay()] as Day["dayOfWeek"];
    return schedule.Days.find((day) => day.dayOfWeek === dayOfWeek) || null;
}

// Helper: Calcule l'écart en minutes entre deux heures (format "HH:MM")
function calculateDelayInMinutes(actualTime: string, expectedTime: string): number {
    const [actualH, actualM] = actualTime.split(":").map(Number);
    const [expectedH, expectedM] = expectedTime.split(":").map(Number);
    const actualMinutes = actualH * 60 + actualM;
    const expectedMinutes = expectedH * 60 + expectedM;
    return actualMinutes - expectedMinutes;
}

// Helper: Formate l'écart en minutes en texte lisible
function formatDelay(delayMinutes: number): string {
    if (delayMinutes === 0) return "À l'heure";
    const absDelay = Math.abs(delayMinutes);
    const hours = Math.floor(absDelay / 60);
    const minutes = absDelay % 60;
    const sign = delayMinutes > 0 ? "+" : "-";

    if (hours > 0) {
        return `${sign}${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`;
    }
    return `${sign}${minutes}min`;
}

// Fonction pour créer les colonnes avec accès aux contracts
const createColumns = (contracts: Contract[]): ColumnDef<Clock>[] => [
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
        size: 180,
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
        size: 110,
    },
    {
        header: "Actual Time",
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="flex items-center gap-2">
                    <ClockIcon className="text-muted-foreground size-4" />
                    <span className="font-medium">
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
    {
        header: "Contract",
        cell: ({ row }) => {
            const clockDate = new Date(row.original.date);
            const result = findActiveSchedule(contracts, clockDate);

            if (!result) {
                return <span className="text-muted-foreground text-sm">-</span>;
            }

            const { contract } = result;
            return (
                <Badge
                    className={cn(
                        contract.contractType === "CDI" && "text-primary-foreground bg-green-500/80",
                        contract.contractType === "CDD" && "text-primary-foreground bg-blue-500/80",
                        contract.contractType === "INTERIM" && "text-primary-foreground bg-orange-500/80",
                        contract.contractType === "STAGE" && "text-primary-foreground bg-purple-500/80",
                    )}
                >
                    {contract.contractType}
                </Badge>
            );
        },
        size: 100,
    },
    {
        header: "Schedule Period",
        cell: ({ row }) => {
            const clockDate = new Date(row.original.date);
            const result = findActiveSchedule(contracts, clockDate);

            if (!result) {
                return <span className="text-muted-foreground text-sm">-</span>;
            }

            const { schedule } = result;
            const startDate = new Date(schedule.startDate).toLocaleDateString("fr-FR");
            const endDate = schedule.endDate ? new Date(schedule.endDate).toLocaleDateString("fr-FR") : "En cours";

            return (
                <div className="text-sm">
                    {startDate} - {endDate}
                </div>
            );
        },
        size: 180,
    },
    {
        header: "Expected Time",
        cell: ({ row }) => {
            const clockDate = new Date(row.original.date);
            const result = findActiveSchedule(contracts, clockDate);

            if (!result) {
                return <span className="text-muted-foreground text-sm">-</span>;
            }

            const { schedule } = result;
            const dayConfig = findDayConfig(schedule, clockDate);

            if (!dayConfig) {
                return <span className="text-muted-foreground text-sm">Non configuré</span>;
            }

            const checkType = row.original.checkType;
            const expectedTime = checkType === "CHECKIN" ? dayConfig.arriving : dayConfig.leaving;

            return (
                <div className="flex items-center gap-2">
                    <ClockIcon className="text-muted-foreground size-4" />
                    <span>{expectedTime}</span>
                </div>
            );
        },
        size: 130,
    },
    {
        header: "Delay",
        cell: ({ row }) => {
            const checkType = row.original.checkType;

            // Afficher le délai uniquement pour les CHECKIN
            if (checkType !== "CHECKIN") {
                return <span className="text-muted-foreground text-sm">-</span>;
            }

            const clockDate = new Date(row.original.date);
            const actualTime = new Date(row.original.createdAt);
            const result = findActiveSchedule(contracts, clockDate);

            if (!result) {
                return <span className="text-muted-foreground text-sm">-</span>;
            }

            const { schedule } = result;
            const dayConfig = findDayConfig(schedule, clockDate);

            if (!dayConfig) {
                return <span className="text-muted-foreground text-sm">-</span>;
            }

            const actualTimeStr = actualTime.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const delayMinutes = calculateDelayInMinutes(actualTimeStr, dayConfig.arriving);
            const delayText = formatDelay(delayMinutes);

            // Couleurs selon le retard
            let badgeClass = "";
            let icon = null;

            if (delayMinutes <= 0) {
                // À l'heure ou en avance
                badgeClass = "text-primary-foreground bg-green-500/80";
                icon = <CheckCircleIcon className="size-3" />;
            } else if (delayMinutes <= 15) {
                // Léger retard (1-15 min)
                badgeClass = "text-primary-foreground bg-orange-500/80";
                icon = <AlertCircleIcon className="size-3" />;
            } else {
                // Retard important (+15 min)
                badgeClass = "text-primary-foreground bg-red-500/80";
                icon = <AlertCircleIcon className="size-3" />;
            }

            return (
                <Badge className={cn(badgeClass, "gap-1")}>
                    {icon}
                    {delayText}
                </Badge>
            );
        },
        size: 120,
    },
];

export default function ClocksTable({ clocks, contracts }: ClocksTableProps) {
    const columns = createColumns(contracts);

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
