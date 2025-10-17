import { DaySchedule } from "./getClockData";

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

type GetScheduleParams = {
    schedule: Schedule;
};

/**
 * Prépare le planning hebdomadaire
 */
export async function getSchedule(props: GetScheduleParams): Promise<DaySchedule[]> {
    const { schedule } = props;

    return schedule.Days.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        arriving: day.arriving,
        leaving: day.leaving,
        break: day.breack,
    }));
}
