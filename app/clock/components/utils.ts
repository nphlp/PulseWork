import { DayOfWeek } from "@prisma/client";
import dayjs from "dayjs";
import { CheckStatus } from "./getClockData";

/**
 * Convertit un jour de la semaine JS (0=dimanche) en enum DayOfWeek
 */
export function getDayOfWeek(date: Date): DayOfWeek {
    const day = date.getDay();
    const mapping: Record<number, DayOfWeek> = {
        0: "SUNDAY",
        1: "MONDAY",
        2: "TUESDAY",
        3: "WEDNESDAY",
        4: "THURSDAY",
        5: "FRIDAY",
        6: "SATURDAY",
    };
    return mapping[day];
}

/**
 * Calcule le statut d'un pointage
 */
export function getCheckStatus(expectedTime: string, clockedAt: Date | null, now: Date): CheckStatus {
    if (clockedAt) return "checked";

    const [hours, minutes] = expectedTime.split(":").map(Number);
    const expected = dayjs(now).hour(hours).minute(minutes).second(0);
    const diffMinutes = dayjs(now).diff(expected, "minute", true);

    if (diffMinutes < -15) return "too_early"; // Plus de 15min avant
    if (diffMinutes <= 15) return "on_time"; // De -15min à +15min
    if (diffMinutes <= 60) return "late"; // De +15min à +1h
    return "missed"; // Plus d'1h après
}

/**
 * Formate la durée depuis un événement manqué
 */
export function formatMissedSince(time: string, now: Date): string {
    const [hours, minutes] = time.split(":").map(Number);
    const expected = dayjs(now).hour(hours).minute(minutes).second(0);
    const diffHours = dayjs(now).diff(expected, "hour");

    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
}

/**
 * Formate un temps relatif depuis une date
 */
export function formatRelativeTime(date: Date, now: Date): string {
    const diffMinutes = dayjs(now).diff(date, "minute");
    const diffHours = dayjs(now).diff(date, "hour");
    const diffDays = dayjs(now).diff(date, "day");

    if (diffDays > 1) return `Il y a ${diffDays} jours`;
    if (diffDays === 1) return "Hier";
    if (diffHours > 0) return `Il y a ${diffHours}h`;
    if (diffMinutes > 0) return `Il y a ${diffMinutes}min`;
    return "À l'instant";
}
