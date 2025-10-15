import { SidebarProvider, SidebarTrigger } from "@shadcn/ui/sidebar";
import { AppSidebar } from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
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
