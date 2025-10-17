import { requireRole } from "@lib/permissions";
import { UserFindManyAction } from "@services/actions/UserAction";
import EmployeesTable from "./components/EmployeesTable";

export default async function Page() {
    await requireRole(["ADMIN", "MANAGER"]);

    const allUsers = await UserFindManyAction({
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

    // Filter users by role
    const admins = allUsers.filter((user) => user.role === "ADMIN");
    const managers = allUsers.filter((user) => user.role === "MANAGER");
    const employees = allUsers.filter((user) => user.role === "EMPLOYEE");

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Members</h1>
                <p className="text-muted-foreground mt-2">Manage your company members and their contracts.</p>
            </div>

            {/* Admins Table */}
            <div className="mb-12">
                <h2 className="mb-4 text-2xl font-semibold">Admins</h2>
                <EmployeesTable employees={admins} />
            </div>

            {/* Managers Table */}
            <div className="mb-12">
                <h2 className="mb-4 text-2xl font-semibold">Managers</h2>
                <EmployeesTable employees={managers} />
            </div>

            {/* Employees Table */}
            <div className="mb-12">
                <h2 className="mb-4 text-2xl font-semibold">Employees</h2>
                <EmployeesTable employees={employees} />
            </div>
        </div>
    );
}
