import { Schedule, Work } from "@prisma/client";
import { ClockFindManyServer } from "@services/server/ClockServer";
import dayjs from "dayjs";
import { CurrentDayCheck } from "./getClockData";
import { getCheckStatus, getDayOfWeek } from "./utils";

type GetCurrentDayCheckParams = {
    now: Date;
    schedule: Schedule & { Works: Work[] };
    employeeId: string;
};

/**
 * Construit les données du jour actuel (checkin et checkout)
 * Approche optimisée avec fetch dédié et dayjs
 */
export async function getCurrentDayCheck(props: GetCurrentDayCheckParams): Promise<CurrentDayCheck | null> {
    const { now, schedule, employeeId } = props;

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

    // Récupérer uniquement les clocks d'aujourd'hui
    const todayStart = dayjs(now).startOf("day").toDate();
    const todayEnd = dayjs(now).endOf("day").toDate();

    const todayClocks = await ClockFindManyServer({
        where: {
            employeeId,
            date: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
    });

    // Trouver le pointage d'arrivée et de départ
    const todayCheckin = todayClocks.find((c) => c.checkType === "CHECKIN");
    const todayCheckout = todayClocks.find((c) => c.checkType === "CHECKOUT");

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
