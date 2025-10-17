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
    const worksForDay = schedule.Works.filter((d) => d.arrivingDay === currentDayOfWeek);

    if (!worksForDay.length) {
        return null;
    }

    // Trouver le Work pour le check-in (pointingArrival=true) et le check-out (pointingDeparture=true)
    const checkinWork = worksForDay.find((w) => w.pointingArrival);
    const checkoutWork = worksForDay.find((w) => w.pointingDeparture);

    if (!checkinWork || !checkoutWork) {
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

    const checkinStatus = getCheckStatus(checkinWork.arriving, todayCheckin ? todayCheckin.date : null, now);
    const checkoutStatus = getCheckStatus(checkoutWork.leaving, todayCheckout ? todayCheckout.date : null, now);

    return {
        date: now,
        dayOfWeek: currentDayOfWeek,
        arriving: checkinWork.arriving,
        leaving: checkoutWork.leaving,
        checkin: {
            type: "CHECKIN",
            time: checkinWork.arriving,
            status: checkinStatus,
            clockId: todayCheckin?.id,
            clockedAt: todayCheckin?.date,
        },
        checkout: {
            type: "CHECKOUT",
            time: checkoutWork.leaving,
            status: checkoutStatus,
            clockId: todayCheckout?.id,
            clockedAt: todayCheckout?.date,
        },
    };
}
