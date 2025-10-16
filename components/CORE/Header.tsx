"use client";

import { Session } from "@lib/authServer";
import { startsWith } from "lodash";
import { usePathname } from "next/navigation";
import Links from "./Header/Links";
import ProfileIcon from "./Header/ProfileIcon";
import ThemeDropdown from "./theme/theme-dropdown";

type HeaderProps = {
    serverSession: Session | null;
};

export default function Header(props: HeaderProps) {
    const { serverSession } = props;

    const path = usePathname();

    if (startsWith(path, "/dashboard")) return null;

    return (
        <header className="flex w-full items-center justify-end gap-4 px-5 py-3">
            <Links serverSession={serverSession} />
            <ProfileIcon serverSession={serverSession} />
            <ThemeDropdown />
        </header>
    );
}
