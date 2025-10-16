import { UserFindUniqueAction } from "@actions/UserAction";
import { notFound } from "next/navigation";
import ClocksTable from "./components/ClocksTable";
import ContractsTable from "./components/ContractsTable";
import EmployeeCard from "./components/EmployeeCard";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
    const params = await props.params;
    const { id } = params;

    const employee = await UserFindUniqueAction({
        where: { id },
        include: {
            Contracts: {
                include: {
                    Schedules: {
                        include: {
                            Days: {
                                orderBy: {
                                    dayOfWeek: "asc",
                                },
                            },
                        },
                        orderBy: {
                            startDate: "desc",
                        },
                    },
                },
                orderBy: {
                    startDate: "desc",
                },
            },
            Leaves: {
                orderBy: {
                    startDate: "desc",
                },
            },
            TimeEntries: {
                orderBy: {
                    date: "desc",
                },
                take: 10, // Derniers 10 pointages
            },
        },
    });

    if (!employee) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-8">
                {/* Employee Card */}
                <EmployeeCard employee={employee} />

                {/* Contracts Table */}
                <div>
                    <h2 className="mb-4 text-2xl font-bold">Contracts & Schedules</h2>
                    <ContractsTable contracts={employee.Contracts} />
                </div>

                {/* Clocks Table */}
                <div>
                    <h2 className="mb-4 text-2xl font-bold">Recent Clock Entries</h2>
                    <ClocksTable clocks={employee.TimeEntries} contracts={employee.Contracts} />
                </div>
            </div>
        </div>
    );
}
