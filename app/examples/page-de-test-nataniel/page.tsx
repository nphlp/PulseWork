"use client";

import { useState } from "react";

function Calendar() {
    const [current, setCurrent] = useState(() => new Date());

    const year = current.getFullYear();
    const month = current.getMonth(); // 0-11

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastOfMonth.getDate();
    const startWeekday = firstOfMonth.getDay();

    const cells: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    function prevMonth() {
        setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }
    function nextMonth() {
        setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="text-xl font-medium text-black dark:text-black">
                    {current.toLocaleString(undefined, { month: "long", year: "numeric" })}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="rounded bg-slate-100 px-2 py-1 text-white dark:bg-black"
                        aria-label="Mois précédent"
                    >
                        <p className="text-gray-900 dark:text-white">‹</p>
                    </button>
                    <button
                        onClick={nextMonth}
                        className="rounded bg-slate-100 px-2 py-1 text-gray-900 dark:bg-black"
                        aria-label="Mois suivant"
                    >
                        <p className="text-gray-900 dark:text-white">›</p>
                    </button>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-black dark:text-black">
                {["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((d) => (
                    <div key={d} className="text-center font-semibold">
                        {d}
                    </div>
                ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
                {cells.map((val, idx) => {
                    const isToday =
                        val &&
                        new Date().getFullYear() === year &&
                        new Date().getMonth() === month &&
                        new Date().getDate() === val;
                    return (
                        <div
                            key={idx}
                            className={
                                "flex h-12 items-center justify-center rounded-md text-sm " +
                                (val
                                    ? isToday
                                        ? " bg-emerald-800 font-bold text-white dark:bg-emerald-600"
                                        : "border border-slate-200 bg-white/80 text-slate-900 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
                                    : "bg-transparent")
                            }
                        >
                            {val ?? ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Page() {
    const [btnColorIndex, setBtnColorIndex] = useState(0);
    const btnColors = ["bg-blue-400", "bg-indigo-600", "bg-amber-600", "bg-rose-500", "bg-emerald-500"];

    function cycleBtnColor() {
        setBtnColorIndex((i) => (i + 1) % btnColors.length);
    }

    return (
        <main className="min-h-screen bg-white dark:bg-neutral-950">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500 shadow">
                    <span className="text-sm font-bold text-white">P</span>
                </div>
                <div>
                    <h1 className="text-lg font-extrabold text-slate-900 dark:text-emerald-500">Page de test</h1>
                    <p className="text-xs text-slate-600 dark:text-emerald-500">Projet Time Manager</p>
                </div>
            </div>
            <section id="content" className="mx-auto max-w-5xl px-6 py-12">
                <h2 className="w-full justify-center text-3xl leading-tight font-extrabold text-emerald-500 sm:text-4xl">
                    PAGE DE POINTAGE
                </h2>
                <p className="mt-3 text-black dark:text-emerald-500">
                    Appuyez sur
                    <span className="font-bold"> CLOCK-IN</span> pour commencer votre journée et
                    <span className="font-bold"> CLOCK-OUT</span> pour la terminer.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-10 lg:mt-8 lg:flex-row lg:items-start">
                    <div className="order-2 flex flex-wrap gap-3 lg:order-1"></div>
                    <a
                        href="/examples/clockin"
                        className="inline-block rounded-lg bg-emerald-500 px-5 py-2 text-white shadow transition hover:bg-emerald-300"
                    >
                        CLOCK-IN
                    </a>
                    <a
                        href="/examples/clockout"
                        className="inline-block rounded-lg bg-emerald-500 px-5 py-2 text-white shadow transition hover:bg-emerald-300"
                    >
                        CLOCK-OUT
                    </a>
                </div>
                <div className="mt-7 w-full">
                    <div className="w-full overflow-hidden rounded-xl bg-gradient-to-tr from-emerald-300 to-emerald-500 p-6 text-black shadow-lg dark:text-black">
                        <h3 className="text-lg font-bold">HORAIRES DE VOTRE JOURNEE</h3>
                        <p className="text-sm">Retrouvez ici un dashboard avec un résumé de vos journées</p>

                        <div className="mt-4 min-h-[320px] w-full rounded-md bg-emerald-500 p-4 dark:bg-white/40">
                            <Calendar />
                        </div>
                    </div>
                </div>
                <div className="mt-7"></div>
                <div className="mt-7 flex justify-center">
                    <button
                        onClick={cycleBtnColor}
                        className={`items-center justify-center rounded-md px-3 py-1 text-white transition hover:opacity-95 ${btnColors[btnColorIndex]}`}
                        aria-label="Changer la couleur du bouton"
                    >
                        Changer la couleur
                    </button>
                </div>
                <div className="mt-7"></div>
            </section>
        </main>
    );
}
