"use server";

import { redirect, unauthorized } from "next/navigation";
import { getSession } from "./authServer";

export const requireRole = async (allowedRoles: string[]) => {
    const session = await getSession();

    if (!session?.user) {
        redirect("/login");
    }

    if (!allowedRoles.includes(session.user.role)) {
        unauthorized();
    }

    return session;
};

export const autoRedirectIfLoggedIn = async () => {
    const session = await getSession();

    if (session) {
        const role = session.user.role;

        if (role === "ADMIN" || role === "MANAGER") {
            return redirect("/dashboard");
        }

        return redirect("/examples/task");
    }

    return;
};
