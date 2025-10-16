import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@shadcn/ui/sidebar";
import { Home, LayoutDashboard, UserPen, Users } from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { JSX } from "react";
import Logout from "./logout";

type Item = {
    title: string;
    url: Route;
    icon: JSX.ElementType;
};

const items: Item[] = [
    {
        title: "KPIs",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Teams",
        url: "/dashboard/teams",
        icon: Users,
    },
    {
        title: "Members",
        url: "/dashboard/members",
        icon: UserPen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent className="flex flex-col justify-between">
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Retour</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/examples/task"}>
                                        <Home />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Logout />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
