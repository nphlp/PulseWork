"use client";

import Link from "@comps/UI/button/link";
import { useSession } from "@lib/authClient";
import { Session } from "@lib/authServer";
import { combo } from "@lib/combo";
import { usePathname } from "next/navigation";

type LinksProps = {
    serverSession?: Session;
    scrollToTop?: boolean;
};

export default function Links(props: LinksProps) {
    const { serverSession, scrollToTop = false } = props;

    const { data: sessionClient, isPending } = useSession();
    const session = isPending ? serverSession : sessionClient;

    const path = usePathname();

    const handleNativation = () => {
        const mainId = document.getElementById("main");
        if (scrollToTop && mainId) mainId.scrollTo({ top: 0, behavior: "smooth" });
    };

    const userRole = session?.user.role;
    const hasAccessToDashboard = userRole === "ADMIN" || userRole === "MANAGER";

    return (
        <div className="flex gap-2">
            {hasAccessToDashboard && (
                <Link
                    label="Board"
                    href="/dashboard"
                    variant="ghost"
                    onNavigate={handleNativation}
                    className={combo("text-lg", path === "/dashboard" && "font-bold")}
                />
            )}
            <Link
                label="Examples"
                href="/examples"
                variant="ghost"
                onNavigate={handleNativation}
                className={combo("text-lg", path === "/examples" && "font-bold")}
            />
        </div>
    );
}
