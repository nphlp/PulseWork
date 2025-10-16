import { UserFindManyAction } from "@actions/UserAction";
import EmployeesTable from "./components/EmployeesTable";

export default async function Page() {
    const employees = await UserFindManyAction({
        include: {
            Contracts: {
                select: {
                    id: true,
                    contractType: true,
                    startDate: true,
                    endDate: true,
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
                <h1 className="text-3xl font-bold">Employees</h1>
                <p className="text-muted-foreground mt-2">Manage your company employees and their contracts.</p>
            </div>

            <EmployeesTable employees={employees} />
        </div>
    );
}
