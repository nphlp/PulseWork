import { DayOfWeek } from "@prisma/client";
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
    const expected = new Date(now);
    expected.setHours(hours, minutes, 0, 0);

    const diffMs = now.getTime() - expected.getTime();
    const diffMinutes = diffMs / (1000 * 60);

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
    const expected = new Date(now);
    expected.setHours(hours, minutes, 0, 0);

    const diffMs = now.getTime() - expected.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
}
