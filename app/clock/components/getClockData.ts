import { CheckType, Clock, DayOfWeek, Work } from "@prisma/client";
import { ClockFindManyServer } from "@services/server/ClockServer";
import { ContractFindFirstServer } from "@services/server/ContractServer";
import dayjs from "dayjs";
import { getCurrentDayCheck } from "./getCurrentDayCheck";
import { getMissedChecks } from "./getMissedChecks";

/**
 * Types pour la logique de pointage
 */
export type CheckStatus = "checked" | "too_early" | "on_time" | "late" | "missed";

export type CheckInfo = {
    type: CheckType;
    time: string; // Format "HH:MM" - Heure attendue
    status: CheckStatus;
    clockId?: string; // Si déjà pointé
    clockedAt?: Date; // Heure réelle de pointage
};

export type CurrentDayCheck = {
    date: Date;
    dayOfWeek: DayOfWeek;
    arriving: string;
    leaving: string;
    checkin: CheckInfo;
    checkout: CheckInfo;
};

export type MissedCheck = {
    date: Date;
    type: CheckType;
    time: string;
    missedSince: string; // Ex: "Il y a 2 heures"
};

export type RecentCheck = {
    id: string;
    date: Date;
    type: CheckType;
    createdAt: Date;
};

export type ContratPeriod = {
    from: Date;
    to: Date | null;
};

export type SchedulePeriod = {
    from: Date;
    to: Date | null;
};

export type ClockData = {
    contrat: ContratPeriod | null;
    schedule: SchedulePeriod | null;
    days: Work[] | null;
    currentDay: CurrentDayCheck | null;
    missedChecks: MissedCheck[];
    recentChecks: Clock[];
};

const getNow = (debugTime?: string): Date => {
    if (debugTime && process.env.NODE_ENV === "development") {
        const [hours, minutes] = debugTime.split(":").map(Number);
        return dayjs().hour(hours).minute(minutes).second(0).millisecond(0).toDate();
    }
    return new Date();
};

/**
 * Récupère les données de pointage pour un employé
 */
export async function getClockData(employeeId: string, debugTime?: string): Promise<ClockData> {
    const now = getNow(debugTime);

    // Trouver le contrat et planning actif
    const contract = await ContractFindFirstServer({
        where: {
            employeeId,
            startDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
        include: {
            Schedules: {
                where: {
                    startDate: { lte: now },
                    OR: [{ endDate: null }, { endDate: { gte: now } }],
                },
                include: {
                    Works: true,
                },
            },
        },
        orderBy: { startDate: "desc" },
    });

    if (!contract || !contract.Schedules.length) {
        return {
            contrat: null,
            schedule: null,
            days: null,
            currentDay: null,
            missedChecks: [],
            recentChecks: [],
        };
    }

    // On prend le seul planning actif (il ne peuvent pas se chevaucher)
    const schedule = contract.Schedules[0];

    // Récupérer les derniers pointages pour la card "Pointages récents"
    const recentClocks = await ClockFindManyServer({
        where: { employeeId },
        orderBy: { date: "desc" },
        take: 5,
    });

    // Appeler les fonctions spécialisées (chacune fait son propre fetch optimisé)
    const [currentWork, missedChecks] = await Promise.all([
        getCurrentDayCheck({ now, schedule, employeeId }),
        getMissedChecks({ now, schedule, employeeId }),
    ]);

    return {
        contrat: { from: contract.startDate, to: contract.endDate },
        schedule: { from: schedule.startDate, to: schedule.endDate },
        days: schedule.Works,
        currentDay: currentWork,
        missedChecks,
        recentChecks: recentClocks,
    };
}
