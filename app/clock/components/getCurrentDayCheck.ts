import { Clock, Schedule, Work } from "@prisma/client";
import { CurrentDayCheck } from "./getClockData";
import { getCheckStatus, getDayOfWeek } from "./utils";

type GetCurrentDayCheckParams = {
    now: Date;
    today: Date;
    schedule: Schedule & { Works: Work[] };
    employeeClocks: Clock[];
};

/**
 * Construit les données du jour actuel (checkin et checkout)
 */
export async function getCurrentDayCheck(props: GetCurrentDayCheckParams): Promise<CurrentDayCheck | null> {
    const { now, today, schedule, employeeClocks } = props;

    // Récupérer le jour de la semaine actuel
    const currentDayOfWeek = getDayOfWeek(now);

    // Trouver les configurations du jour dans le planning
    const dayConfigs = schedule.Works.filter((d) => d.arrivingDay === currentDayOfWeek);

    if (!dayConfigs.length) {
        return null;
    }

    // Pour le moment, on prend la première période (logique à affiner si plusieurs périodes par jour)
    const dayConfig = dayConfigs[0];

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
