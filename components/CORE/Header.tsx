"use client";

import LinkButton from "@comps/UI/button/link";
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
        <header className="fixed top-0 left-0 z-50 flex w-full flex-col items-center justify-between bg-white px-6 py-3 shadow md:flex-row dark:bg-neutral-950">
            {/* Titre et boutons de session */}
            <div className="flex flex-col items-center gap-3 md:flex-row">
                <h1 className="text-2xl font-extrabold text-[var(--chart-2)] md:text-3xl dark:text-[var(--chart-3)]">
                    Pulse-Work
                </h1>
                <div className="mt-2 flex flex-wrap gap-3 md:mt-0">
                    {serverSession ? (
                        <LinkButton
                            href="/examples/task"
                            label="Accéder à mes tâches"
                            className="rounded-full border px-4 py-2 text-base font-medium text-[var(--chart-2)] shadow transition-all duration-300 hover:scale-105 dark:text-[var(--chart-3)]"
                        />
                    ) : (
                        <>
                            <LinkButton
                                href="/login"
                                label="Connexion"
                                className="rounded-full border border-[var(--chart-2)] bg-[var(--chart-2)] px-4 py-2 text-base font-medium text-white shadow transition-all duration-300 hover:scale-105 active:scale-95 dark:border-[var(--chart-3)] dark:bg-[var(--chart-3)]"
                            />
                            <LinkButton
                                href="/register"
                                label="Demander une démo"
                                className="rounded-full border border-[var(--chart-2)] bg-[var(--chart-2)] px-4 py-2 text-base font-medium text-white shadow transition-all duration-300 hover:scale-105 active:scale-95 dark:border-[var(--chart-3)] dark:bg-[var(--chart-3)]"
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Liens existants, profil et thème */}
            <div className="mt-2 flex items-center gap-4 md:mt-0">
                <Links serverSession={serverSession} />
                <ProfileIcon serverSession={serverSession} />
                <ThemeDropdown />
            </div>
        </header>
    );
}
