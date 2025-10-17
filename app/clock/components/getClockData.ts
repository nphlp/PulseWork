import { CheckType, Clock, Day, DayOfWeek } from "@prisma/client";
import { ClockFindManyServer } from "@services/server/ClockServer";
import { ContractFindFirstServer } from "@services/server/ContractServer";
import { getCurrentDayCheck } from "./getCurrentDayCheck";
import { getMissedChecks } from "./getMissedChecks";

/**
 * Types pour la logique de pointage
 */
export type CheckStatus = "checked" | "too_early" | "on_time" | "late" | "missed";

export type CheckInfo = {
    type: CheckType;
    time: string; // Format "HH:MM"
    status: CheckStatus;
    clockId?: string; // Si déjà pointé
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
    days: Day[] | null;
    currentDay: CurrentDayCheck | null;
    missedChecks: MissedCheck[];
    recentChecks: Clock[];
};

const getTodayAndNow = (): { now: Date; today: Date } => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return { now, today };
};

/**
 * Récupère les données de pointage pour un employé
 */
export async function getClockData(employeeId: string): Promise<ClockData> {
    const { now, today } = getTodayAndNow();

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
                    Days: true,
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

    // Récupérer tous les pointages de l'employé
    const employeeClocks = await ClockFindManyServer({
        where: { employeeId },
        orderBy: { date: "desc" },
        take: 50,
    });

    // Appeler les 4 fonctions spécialisées
    const [currentDay, missedChecks] = await Promise.all([
        getCurrentDayCheck({ now, today, schedule, employeeClocks }),
        getMissedChecks({ now, schedule, employeeClocks }),
    ]);

    return {
        contrat: { from: contract.startDate, to: contract.endDate },
        schedule: { from: schedule.startDate, to: schedule.endDate },
        days: schedule.Days,
        currentDay,
        missedChecks,
        recentChecks: employeeClocks.slice(0, 5),
    };
}
