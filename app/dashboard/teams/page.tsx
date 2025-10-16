import { requireRole } from "@lib/permissions";
import { cn } from "@shadcn/lib/utils";
import { Badge } from "@shadcn/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shadcn/ui/table";
import Link from "next/link";
import { TeamFindManyAction } from "@/services/actions/TeamAction";

export default async function Page() {
    await requireRole(["ADMIN", "MANAGER"]);

    const teams = await TeamFindManyAction({
        include: {
            Manager: {
                select: {
                    id: true,
                    name: true,
                    lastname: true,
                    email: true,
                    role: true,
                    Contracts: {
                        select: {
                            id: true,
                            contractType: true,
                            startDate: true,
                            endDate: true,
                        },
                    },
                },
            },
            Members: {
                include: {
                    User: {
                        select: {
                            id: true,
                            name: true,
                            lastname: true,
                            email: true,
                            role: true,
                            Contracts: {
                                select: {
                                    id: true,
                                    contractType: true,
                                    startDate: true,
                                    endDate: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Teams</h1>
                <p className="text-muted-foreground mt-2">Manage your company teams and their members.</p>
            </div>

            <div className="space-y-8">
                {teams.map((team) => {
                    // Trouver le contrat actif
                    const getActiveContract = (contracts: typeof team.Manager.Contracts) => {
                        return contracts.find((c) => !c.endDate || new Date(c.endDate) > new Date());
                    };

                    const managerActiveContract = getActiveContract(team.Manager.Contracts);

                    return (
                        <Card key={team.id}>
                            <CardHeader>
                                <CardTitle className="text-2xl">{team.name}</CardTitle>
                                <CardDescription>
                                    Manager:{" "}
                                    <Link
                                        href={`/dashboard/members/${team.Manager.id}`}
                                        className="text-foreground font-medium hover:underline"
                                    >
                                        {team.Manager.name} {team.Manager.lastname}
                                    </Link>
                                    <span className="text-muted-foreground"> ({team.Members.length} members)</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Active Contract</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Manager row */}
                                        <TableRow className="bg-muted/50">
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/dashboard/members/${team.Manager.id}`}
                                                    className="text-foreground font-medium hover:underline"
                                                >
                                                    {team.Manager.name} {team.Manager.lastname}
                                                </Link>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                    Manager
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{team.Manager.email}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        team.Manager.role === "ADMIN" &&
                                                            "text-primary-foreground bg-red-500/80",
                                                        team.Manager.role === "MANAGER" &&
                                                            "text-primary-foreground bg-blue-500/80",
                                                        team.Manager.role === "EMPLOYEE" &&
                                                            "text-primary-foreground bg-green-500/80",
                                                    )}
                                                >
                                                    {team.Manager.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {managerActiveContract ? (
                                                    <Badge
                                                        className={cn(
                                                            managerActiveContract.contractType === "CDI" &&
                                                                "text-primary-foreground bg-green-500/80",
                                                            managerActiveContract.contractType === "CDD" &&
                                                                "text-primary-foreground bg-blue-500/80",
                                                            managerActiveContract.contractType === "INTERIM" &&
                                                                "text-primary-foreground bg-orange-500/80",
                                                            managerActiveContract.contractType === "STAGE" &&
                                                                "text-primary-foreground bg-purple-500/80",
                                                        )}
                                                    >
                                                        {managerActiveContract.contractType}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No contract</span>
                                                )}
                                            </TableCell>
                                        </TableRow>

                                        {/* Member rows */}
                                        {team.Members.map((member) => {
                                            const memberActiveContract = getActiveContract(member.User.Contracts);
                                            return (
                                                <TableRow key={member.id}>
                                                    <TableCell className="font-medium">
                                                        <Link
                                                            href={`/dashboard/members/${member.User.id}`}
                                                            className="text-foreground hover:underline"
                                                        >
                                                            {member.User.name} {member.User.lastname}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{member.User.email}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={cn(
                                                                member.User.role === "ADMIN" &&
                                                                    "text-primary-foreground bg-red-500/80",
                                                                member.User.role === "MANAGER" &&
                                                                    "text-primary-foreground bg-blue-500/80",
                                                                member.User.role === "EMPLOYEE" &&
                                                                    "text-primary-foreground bg-green-500/80",
                                                            )}
                                                        >
                                                            {member.User.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {memberActiveContract ? (
                                                            <Badge
                                                                className={cn(
                                                                    memberActiveContract.contractType === "CDI" &&
                                                                        "text-primary-foreground bg-green-500/80",
                                                                    memberActiveContract.contractType === "CDD" &&
                                                                        "text-primary-foreground bg-blue-500/80",
                                                                    memberActiveContract.contractType === "INTERIM" &&
                                                                        "text-primary-foreground bg-orange-500/80",
                                                                    memberActiveContract.contractType === "STAGE" &&
                                                                        "text-primary-foreground bg-purple-500/80",
                                                                )}
                                                            >
                                                                {memberActiveContract.contractType}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">
                                                                No contract
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
