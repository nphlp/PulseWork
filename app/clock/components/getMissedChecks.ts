import { Work } from "@prisma/client";
import { ClockFindManyServer } from "@services/server/ClockServer";
import dayjs from "dayjs";
import { MissedCheck } from "./getClockData";
import { formatRelativeTime, getDayOfWeek } from "./utils";

type Schedule = {
    Works: Work[];
};

type GetMissedChecksParams = {
    now: Date;
    schedule: Schedule;
    employeeId: string;
};

/**
 * Calcule les pointages manqués (depuis plus de 1h)
 * Approche optimisée avec 1 seule requête DB et logique JS avec Set
 */
export async function getMissedChecks(props: GetMissedChecksParams): Promise<MissedCheck[]> {
    const { now, schedule, employeeId } = props;

    // Calculer la date il y a 30 jours
    const thirtyDaysAgo = dayjs(now).subtract(30, "day").startOf("day").toDate();

    // Requête DB : récupérer tous les Clocks des 30 derniers jours
    const clocks = await ClockFindManyServer({
        where: {
            employeeId,
            date: { gte: thirtyDaysAgo },
        },
        orderBy: { date: "desc" },
    });

    // Créer un Set pour recherche O(1) au lieu de find() O(n)
    // Format de la clé : "timestamp-CHECKIN" ou "timestamp-CHECKOUT"
    const clockSet = new Set(
        clocks.map((c) => {
            const timestamp = dayjs(c.date).startOf("day").valueOf();
            return `${timestamp}-${c.checkType}`;
        }),
    );

    // Générer les pointages attendus pour les 30 derniers jours
    const expectedChecks: Array<{
        date: Date;
        type: "CHECKIN" | "CHECKOUT";
        time: string;
        expectedDateTime: Date;
    }> = [];

    for (let i = 0; i < 30; i++) {
        const checkDate = dayjs(now).subtract(i, "day").startOf("day").toDate();
        const dayOfWeek = getDayOfWeek(checkDate);

        // Trouver tous les Works configurés pour ce jour
        const worksForDay = schedule.Works.filter((work) => work.arrivingDay === dayOfWeek);

        for (const work of worksForDay) {
            // CHECKIN attendu si pointingArrival=true
            if (work.pointingArrival) {
                const [hours, minutes] = work.arriving.split(":").map(Number);
                const expectedDateTime = dayjs(checkDate).hour(hours).minute(minutes).second(0).toDate();

                // Vérifier si passé de plus d'1h
                const diffHours = dayjs(now).diff(expectedDateTime, "hour", true);

                if (diffHours > 1) {
                    expectedChecks.push({
                        date: checkDate,
                        type: "CHECKIN",
                        time: work.arriving,
                        expectedDateTime,
                    });
                }
            }

            // CHECKOUT attendu si pointingDeparture=true
            if (work.pointingDeparture) {
                const [hours, minutes] = work.leaving.split(":").map(Number);
                const expectedDateTime = dayjs(checkDate).hour(hours).minute(minutes).second(0).toDate();

                // Vérifier si passé de plus d'1h
                const diffHours = dayjs(now).diff(expectedDateTime, "hour", true);

                if (diffHours > 1) {
                    expectedChecks.push({
                        date: checkDate,
                        type: "CHECKOUT",
                        time: work.leaving,
                        expectedDateTime,
                    });
                }
            }
        }
    }

    // Filtrer les pointages manqués (ceux qui ne sont pas dans clockSet)
    const missedChecks: MissedCheck[] = expectedChecks
        .filter((expected) => {
            const timestamp = dayjs(expected.date).startOf("day").valueOf();
            const key = `${timestamp}-${expected.type}`;
            return !clockSet.has(key);
        })
        .map((expected) => ({
            date: expected.date,
            type: expected.type,
            time: expected.time,
            missedSince: formatRelativeTime(expected.expectedDateTime, now),
        }))
        .slice(0, 5); // Limit 5

    return missedChecks;
}
