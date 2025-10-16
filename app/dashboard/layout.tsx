import { requireRole } from "@lib/permissions";
import { SidebarProvider, SidebarTrigger } from "@shadcn/ui/sidebar";
import { AppSidebar } from "./sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
    await requireRole(["ADMIN", "MANAGER"]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
                <header className="px-5 py-3">
                    <SidebarTrigger className="first:size-7" />
                </header>
                <div className="px-7">{children}</div>
            </div>
        </SidebarProvider>
    );
}
