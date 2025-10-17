import { Clock, Day, Schedule } from "@prisma/client";
import { CurrentDayCheck } from "./getClockData";
import { getCheckStatus, getDayOfWeek } from "./utils";

type GetCurrentDayCheckParams = {
    now: Date;
    today: Date;
    schedule: Schedule & { Days: Day[] };
    employeeClocks: Clock[];
};

/**
 * Construit les données du jour actuel (checkin et checkout)
 */
export async function getCurrentDayCheck(props: GetCurrentDayCheckParams): Promise<CurrentDayCheck | null> {
    const { now, today, schedule, employeeClocks } = props;

    // Récupérer le jour de la semaine actuel
    const currentDayOfWeek = getDayOfWeek(now);

    // Trouver la configuration du jour dans le planning
    const dayConfig = schedule.Days.find((d) => d.dayOfWeek === currentDayOfWeek);

    if (!dayConfig) {
        return null;
    }

    // Trouver le pointage d'arrivée du jour
    const todayCheckin = employeeClocks.find((c) => {
        const clockDate = new Date(c.date);
        clockDate.setHours(0, 0, 0, 0);
        return clockDate.getTime() === today.getTime() && c.checkType === "CHECKIN";
    });

    // Trouver le pointage de départ du jour
    const todayCheckout = employeeClocks.find((c) => {
        const clockDate = new Date(c.date);
        clockDate.setHours(0, 0, 0, 0);
        return clockDate.getTime() === today.getTime() && c.checkType === "CHECKOUT";
    });

    const checkinStatus = getCheckStatus(dayConfig.arriving, todayCheckin ? todayCheckin.date : null, now);
    const checkoutStatus = getCheckStatus(dayConfig.leaving, todayCheckout ? todayCheckout.date : null, now);

    return {
        date: now,
        dayOfWeek: currentDayOfWeek,
        arriving: dayConfig.arriving,
        leaving: dayConfig.leaving,
        checkin: {
            type: "CHECKIN",
            time: dayConfig.arriving,
            status: checkinStatus,
            clockId: todayCheckin?.id,
        },
        checkout: {
            type: "CHECKOUT",
            time: dayConfig.leaving,
            status: checkoutStatus,
            clockId: todayCheckout?.id,
        },
    };
}
