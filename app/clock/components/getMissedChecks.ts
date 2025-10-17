import { MissedCheck } from "./getClockData";
import { formatMissedSince, getDayOfWeek } from "./utils";

type Clock = {
    id: string;
    date: Date;
    checkType: "CHECKIN" | "CHECKOUT";
    employeeId: string;
    createdAt: Date;
    updatedAt: Date;
};

type Day = {
    id: string;
    dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    arriving: string;
    leaving: string;
    breack: number | null;
    scheduleId: string;
    createdAt: Date;
    updatedAt: Date;
};

type Schedule = {
    Days: Day[];
};

type GetMissedChecksParams = {
    now: Date;
    schedule: Schedule;
    employeeClocks: Clock[];
};

/**
 * Calcule les pointages manqués (depuis plus de 1h)
 */
export async function getMissedChecks(props: GetMissedChecksParams): Promise<MissedCheck[]> {
    const { now, schedule, employeeClocks } = props;

    const missedChecks: MissedCheck[] = [];

    // On regarde les 30 derniers jours
    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - i);
        checkDate.setHours(0, 0, 0, 0);

        const dayOfWeek = getDayOfWeek(checkDate);
        const dayConfigForDate = schedule.Days.find((d) => d.dayOfWeek === dayOfWeek);

        if (!dayConfigForDate) continue;

        // Vérifier CHECKIN manqué
        const checkinForDate = employeeClocks.find((c) => {
            const clockDate = new Date(c.date);
            clockDate.setHours(0, 0, 0, 0);
            return clockDate.getTime() === checkDate.getTime() && c.checkType === "CHECKIN";
        });

        if (!checkinForDate) {
            const [hours, minutes] = dayConfigForDate.arriving.split(":").map(Number);
            const expectedCheckin = new Date(checkDate);
            expectedCheckin.setHours(hours, minutes, 0, 0);

            const diffHours = (now.getTime() - expectedCheckin.getTime()) / (1000 * 60 * 60);
            if (diffHours > 1) {
                missedChecks.push({
                    date: checkDate,
                    type: "CHECKIN",
                    time: dayConfigForDate.arriving,
                    missedSince: formatMissedSince(dayConfigForDate.arriving, checkDate),
                });
            }
        }

        // Vérifier CHECKOUT manqué
        const checkoutForDate = employeeClocks.find((c) => {
            const clockDate = new Date(c.date);
            clockDate.setHours(0, 0, 0, 0);
            return clockDate.getTime() === checkDate.getTime() && c.checkType === "CHECKOUT";
        });

        if (!checkoutForDate) {
            const [hours, minutes] = dayConfigForDate.leaving.split(":").map(Number);
            const expectedCheckout = new Date(checkDate);
            expectedCheckout.setHours(hours, minutes, 0, 0);

            const diffHours = (now.getTime() - expectedCheckout.getTime()) / (1000 * 60 * 60);
            if (diffHours > 1) {
                missedChecks.push({
                    date: checkDate,
                    type: "CHECKOUT",
                    time: dayConfigForDate.leaving,
                    missedSince: formatMissedSince(dayConfigForDate.leaving, checkDate),
                });
            }
        }

        if (missedChecks.length >= 5) break;
    }

    return missedChecks;
}
