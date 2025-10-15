"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.back();
        }, 5000);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <main className="bg-white dark:bg-black">
            <h1 className="text-5xl font-semibold text-black dark:text-white">Clock-out effectué avec succès ⏰ </h1>
            <p className="align-text-bottom text-blue-400 dark:text-blue-400">
                Redirection automatique dans 5 secondes...
            </p>
        </main>
    );
}
