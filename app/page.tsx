"use client";

import Link from "@comps/UI/button/link";
import { type Session, getSession } from "@lib/authServer";
import { useEffect, useState } from "react";
import { ChartAreaWorkTime } from "./dashboard/components/chart-area-work-time";
import { ChartBarAttendance } from "./dashboard/components/chart-bar-attendance";
import { ChartLineDelay } from "./dashboard/components/chart-line-delay";

const delayData = [
    { week: "1", delayRate: 15 },
    { week: "2", delayRate: 18 },
    { week: "3", delayRate: 12 },
    { week: "4", delayRate: 20 },
    { week: "5", delayRate: 14 },
    { week: "6", delayRate: 16 },
    { week: "7", delayRate: 11 },
    { week: "8", delayRate: 13 },
    { week: "9", delayRate: 17 },
    { week: "10", delayRate: 15 },
    { week: "11", delayRate: 19 },
    { week: "12", delayRate: 14 },
];

const attendanceData = [
    { week: "1", expected: 40, actual: 38.5 },
    { week: "2", expected: 40, actual: 40.0 },
    { week: "3", expected: 40, actual: 39.2 },
    { week: "4", expected: 40, actual: 37.8 },
    { week: "5", expected: 40, actual: 41.5 },
    { week: "6", expected: 40, actual: 39.8 },
    { week: "7", expected: 40, actual: 40.5 },
    { week: "8", expected: 40, actual: 38.9 },
    { week: "9", expected: 40, actual: 39.5 },
    { week: "10", expected: 40, actual: 40.2 },
    { week: "11", expected: 40, actual: 38.7 },
    { week: "12", expected: 40, actual: 39.9 },
];

const workTimeData = [
    { week: "1", workTime: 38.5 },
    { week: "2", workTime: 40.0 },
    { week: "3", workTime: 39.2 },
    { week: "4", workTime: 37.8 },
    { week: "5", workTime: 41.5 },
    { week: "6", workTime: 39.8 },
    { week: "7", workTime: 40.5 },
    { week: "8", workTime: 38.9 },
    { week: "9", workTime: 39.5 },
    { week: "10", workTime: 40.2 },
    { week: "11", workTime: 38.7 },
    { week: "12", workTime: 39.9 },
];

export default function Page() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const s = await getSession();
                setSession(s);
            } catch (e) {
                console.error("Erreur getSession :", e);
                setSession(null);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-800 transition-colors duration-700 dark:bg-neutral-950 dark:text-white">
            {/* --- Header normal, pas sticky --- */}
            <header className="flex flex-col items-center justify-between bg-white px-6 py-3 shadow md:flex-row dark:bg-neutral-950">
                <h1 className="text-2xl font-extrabold text-[var(--chart-2)] md:text-3xl dark:text-[var(--chart-3)]">
                    Pulse-Work
                </h1>
                <div className="mt-2 flex flex-wrap gap-3 md:mt-0">
                    {session ? (
                        <Link
                            href="/examples/task"
                            label="Accéder à mes tâches"
                            className="hover:bg-opacity-10 rounded-full border px-4 py-2 text-base font-medium text-[var(--chart-2)] shadow transition-all duration-300 hover:scale-105 dark:text-[var(--chart-3)]"
                        />
                    ) : (
                        <>
                            <Link
                                href="/login"
                                label="Connexion"
                                className="rounded-full border border-[var(--chart-2)] bg-[var(--chart-2)] px-4 py-2 text-base font-medium text-white shadow transition-all duration-300 hover:scale-105 active:scale-95 dark:border-[var(--chart-3)] dark:bg-[var(--chart-3)]"
                            />
                            <Link
                                href="/register"
                                label="Demander une démo"
                                className="rounded-full border border-[var(--chart-2)] bg-[var(--chart-2)] px-4 py-2 text-base font-medium text-white shadow transition-all duration-300 hover:scale-105 active:scale-95 dark:border-[var(--chart-3)] dark:bg-[var(--chart-3)]"
                            />
                        </>
                    )}
                </div>
            </header>

            {/* --- Section intro --- */}
            <section className="flex flex-col items-center justify-center space-y-4 px-6 py-10 text-center md:px-12">
                <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-[var(--chart-2)] sm:text-4xl md:text-5xl dark:text-[var(--chart-3)]">
                    Automatisez le suivi du temps, la présence et la productivité de vos salariés
                </h2>
                <p className="mt-2 w-full max-w-6xl text-lg text-[var(--chart-2)] md:text-xl dark:text-[var(--chart-3)]">
                    Simplifiez la gestion de vos équipes grâce à un tableau de bord facile à utiliser et des analyses
                    approfondies.
                </p>
            </section>

            {/* --- Boutons "Assiduité" etc --- */}
            <section className="px-6 pb-10 md:px-12">
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        "Assiduité",
                        "Taux de présence",
                        "Gestion des équipes",
                        "Horaires",
                        "Taux de retard",
                        "Gestion des salariés",
                        "Contrats",
                    ].map((word) => (
                        <button
                            key={word}
                            className="rounded-lg bg-[var(--chart-2)] px-6 py-3 text-lg font-semibold text-white shadow transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-md active:scale-95 dark:bg-[var(--chart-3)]"
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </section>

            {/* --- Graphiques full-width avec zoom --- */}
            <section className="flex flex-col gap-8 px-4 pb-16 md:px-12">
                <div className="w-full rounded-3xl bg-transparent p-4 shadow transition-transform duration-300 hover:scale-105">
                    <ChartLineDelay chartData={delayData} />
                </div>

                <div className="w-full rounded-3xl bg-transparent p-4 shadow transition-transform duration-300 hover:scale-105">
                    <ChartAreaWorkTime chartData={workTimeData} />
                </div>

                <div className="w-full rounded-3xl bg-transparent p-4 shadow transition-transform duration-300 hover:scale-105">
                    <ChartBarAttendance chartData={attendanceData} />
                </div>
            </section>
        </div>
    );
}
