import PrismaInstance from "@lib/prisma";
import { DayOfWeek } from "@prisma/client";

/**
 * Différents types d'horaires de travail
 */
type WorkScheduleType = "STANDARD_9_17" | "STANDARD_8_17" | "TUESDAY_SAT_9_18" | "TUESDAY_SAT_8_16";

/**
 * Définition des horaires de travail
 */
const workSchedules = {
    // Lundi-Vendredi, 9h-17h, 1h de pause
    STANDARD_9_17: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "09:00",
        leaving: "17:00",
        breack: 60, // 1h de pause
    },
    // Lundi-Vendredi, 8h-17h, 2h de pause
    STANDARD_8_17: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "08:00",
        leaving: "17:00",
        breack: 120, // 2h de pause
    },
    // Mardi-Samedi, 9h-18h, 1h de pause
    TUESDAY_SAT_9_18: {
        days: ["TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as DayOfWeek[],
        arriving: "09:00",
        leaving: "18:00",
        breack: 60,
    },
    // Mardi-Samedi, 8h-16h, 1h de pause
    TUESDAY_SAT_8_16: {
        days: ["TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as DayOfWeek[],
        arriving: "08:00",
        leaving: "16:00",
        breack: 60,
    },
};

/**
 * Mapping email -> type d'horaire
 * Permet de définir quel employé a quel type d'horaire
 */
const employeeScheduleTypeMap: Record<string, WorkScheduleType[]> = {
    // ADMIN - horaires standard 9h-17h
    "admin@example.com": ["STANDARD_9_17"],

    // MANAGERS
    "manager@example.com": ["STANDARD_9_17"],
    "thomas.martin@example.com": ["STANDARD_8_17", "STANDARD_9_17"], // Changement d'horaire
    "marie.bernard@example.com": ["TUESDAY_SAT_9_18"],

    // EMPLOYEES avec horaires variés
    "employee@example.com": ["STANDARD_9_17"],
    "lucas.petit@example.com": ["STANDARD_9_17", "TUESDAY_SAT_8_16"], // Changement d'horaire
    "emma.dubois@example.com": ["STANDARD_8_17"],
    "hugo.moreau@example.com": ["TUESDAY_SAT_9_18", "STANDARD_9_17"], // Changement d'horaire
    "lea.simon@example.com": ["STANDARD_9_17"],
    "nathan.laurent@example.com": ["STANDARD_8_17", "TUESDAY_SAT_8_16"], // Changement d'horaire
    "chloe.lefebvre@example.com": ["TUESDAY_SAT_9_18"],
    "antoine.roux@example.com": ["STANDARD_9_17"],
    "camille.garnier@example.com": ["STANDARD_8_17"],
    "maxime.faure@example.com": ["TUESDAY_SAT_9_18", "STANDARD_9_17"], // Changement d'horaire
    "julie.bonnet@example.com": ["TUESDAY_SAT_8_16"],
    "alexandre.rousseau@example.com": ["STANDARD_9_17"], // Stagiaire
};

/**
 * Récupère tous les schedules avec leurs informations de contrat et employé
 */
const getSchedules = async () => {
    return await PrismaInstance.schedule.findMany({
        include: {
            Contract: {
                include: {
                    Employee: true,
                },
            },
        },
        orderBy: [{ Contract: { Employee: { email: "asc" } } }, { startDate: "asc" }],
    });
};

/**
 * Insère les jours de travail pour tous les schedules
 */
export const insertDays = async () => {
    try {
        const schedules = await getSchedules();

        // Grouper les schedules par employé
        const schedulesByEmployee = schedules.reduce(
            (acc, schedule) => {
                const email = schedule.Contract.Employee.email;
                if (!acc[email]) {
                    acc[email] = [];
                }
                acc[email].push(schedule);
                return acc;
            },
            {} as Record<string, (typeof schedules)[number][]>,
        );

        // Pour chaque employé, créer les jours de travail
        for (const [email, employeeSchedules] of Object.entries(schedulesByEmployee)) {
            const scheduleTypes = employeeScheduleTypeMap[email] || ["STANDARD_9_17"];

            // Trier les schedules par date de début
            employeeSchedules.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

            // Assigner un type d'horaire à chaque schedule
            for (let i = 0; i < employeeSchedules.length; i++) {
                const schedule = employeeSchedules[i];
                const scheduleType = scheduleTypes[i] || scheduleTypes[0];
                const workSchedule = workSchedules[scheduleType];

                // Créer les jours de travail pour ce schedule
                for (const dayOfWeek of workSchedule.days) {
                    await PrismaInstance.day.create({
                        data: {
                            dayOfWeek,
                            arriving: workSchedule.arriving,
                            leaving: workSchedule.leaving,
                            breack: workSchedule.breack,
                            scheduleId: schedule.id,
                        },
                    });
                }
            }
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des jours -> " + (error as Error).message);
    }
};
