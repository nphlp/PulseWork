import { cn } from "@shadcn/lib/utils";
import { Badge } from "@shadcn/ui/badge";
import { Card } from "@shadcn/ui/card";
import { BriefcaseIcon, CalendarDaysIcon, ClockIcon, MailIcon, UserIcon } from "lucide-react";

type EmployeeCardProps = {
    employee: {
        id: string;
        name: string;
        lastname: string | null;
        email: string;
        role: "ADMIN" | "MANAGER" | "EMPLOYEE";
        emailVerified: boolean;
        Contracts: unknown[];
        Leaves: unknown[];
        TimeEntries: unknown[];
    };
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
    const fullName = `${employee.name} ${employee.lastname ?? ""}`.trim();

    return (
        <Card className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                {/* Left side - Employee info */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        {/* Avatar placeholder */}
                        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                            <UserIcon className="text-muted-foreground size-8" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">{fullName}</h1>
                            <div className="mt-1 flex items-center gap-2">
                                <MailIcon className="text-muted-foreground size-4" />
                                <span className="text-muted-foreground">{employee.email}</span>
                                {employee.emailVerified && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                        Verified
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Role badge */}
                    <div>
                        <Badge
                            className={cn(
                                "text-sm",
                                employee.role === "ADMIN" && "text-primary-foreground bg-red-500/80",
                                employee.role === "MANAGER" && "text-primary-foreground bg-blue-500/80",
                                employee.role === "EMPLOYEE" && "text-primary-foreground bg-green-500/80",
                            )}
                        >
                            {employee.role}
                        </Badge>
                    </div>
                </div>

                {/* Right side - Statistics */}
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                        <BriefcaseIcon className="text-muted-foreground size-5" />
                        <div className="text-center">
                            <div className="text-2xl font-bold">{employee.Contracts.length}</div>
                            <div className="text-muted-foreground text-xs">
                                Contract{employee.Contracts.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                        <CalendarDaysIcon className="text-muted-foreground size-5" />
                        <div className="text-center">
                            <div className="text-2xl font-bold">{employee.Leaves.length}</div>
                            <div className="text-muted-foreground text-xs">
                                Leave{employee.Leaves.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                        <ClockIcon className="text-muted-foreground size-5" />
                        <div className="text-center">
                            <div className="text-2xl font-bold">{employee.TimeEntries.length}</div>
                            <div className="text-muted-foreground text-xs">
                                Clock{employee.TimeEntries.length !== 1 ? "s" : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
