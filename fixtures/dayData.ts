import PrismaInstance from "@lib/prisma";
import { DayOfWeek } from "@prisma/client";

/**
 * Différents types d'horaires de travail
 */
type WorkScheduleType =
    | "STANDARD_9_17"
    | "STANDARD_8_17"
    | "STANDARD_8_16"
    | "STANDARD_9_18"
    | "STANDARD_10_18"
    | "EARLY_7_15"
    | "LATE_10_19"
    | "TUESDAY_SAT_9_18"
    | "TUESDAY_SAT_8_16"
    | "FLEXIBLE_9_17"
    | "FLEXIBLE_8_30_16_30";

/**
 * Définition des horaires de travail
 */
const workSchedules = {
    // Lundi-Vendredi, 9h-17h, 1h de pause
    STANDARD_9_17: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "09:00",
        leaving: "17:00",
        breack: 60,
    },
    // Lundi-Vendredi, 8h-17h, 1h30 de pause
    STANDARD_8_17: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "08:00",
        leaving: "17:00",
        breack: 90,
    },
    // Lundi-Vendredi, 8h-16h, 1h de pause
    STANDARD_8_16: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "08:00",
        leaving: "16:00",
        breack: 60,
    },
    // Lundi-Vendredi, 9h-18h, 1h30 de pause
    STANDARD_9_18: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "09:00",
        leaving: "18:00",
        breack: 90,
    },
    // Lundi-Vendredi, 10h-18h, 1h de pause
    STANDARD_10_18: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "10:00",
        leaving: "18:00",
        breack: 60,
    },
    // Lundi-Vendredi, 7h-15h, 1h de pause (horaire matinal)
    EARLY_7_15: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "07:00",
        leaving: "15:00",
        breack: 60,
    },
    // Lundi-Vendredi, 10h-19h, 1h30 de pause (horaire tardif)
    LATE_10_19: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "10:00",
        leaving: "19:00",
        breack: 90,
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
    // Lundi-Vendredi, 9h-17h, 45min de pause (horaire flexible)
    FLEXIBLE_9_17: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "09:00",
        leaving: "17:00",
        breack: 45,
    },
    // Lundi-Vendredi, 8h30-16h30, 1h de pause
    FLEXIBLE_8_30_16_30: {
        days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as DayOfWeek[],
        arriving: "08:30",
        leaving: "16:30",
        breack: 60,
    },
};

/**
 * Mapping email -> type d'horaire
 * Permet de définir quel employé a quel type d'horaire
 * Chaque employé avec plusieurs schedules a des horaires DIFFÉRENTS
 */
const employeeScheduleTypeMap: Record<string, WorkScheduleType[]> = {
    // ADMIN - 3 schedules avec horaires différents
    "admin@example.com": ["EARLY_7_15", "STANDARD_8_17", "STANDARD_9_17"],

    // MANAGERS
    // Manager Generic - 2 schedules différents
    "manager@example.com": ["STANDARD_9_17", "STANDARD_10_18"],

    // Thomas Martin - 3 schedules (CDD + 2 pour CDI)
    "thomas.martin@example.com": ["STANDARD_8_16", "STANDARD_8_17", "STANDARD_9_17"],

    // Marie Bernard - 5 schedules (STAGE + CDD + 3 pour CDI)
    "marie.bernard@example.com": [
        "TUESDAY_SAT_9_18",
        "TUESDAY_SAT_8_16",
        "STANDARD_9_17",
        "STANDARD_9_18",
        "LATE_10_19",
    ],

    // EMPLOYEES
    // Employee Generic - 2 schedules
    "employee@example.com": ["STANDARD_9_17", "FLEXIBLE_9_17"],

    // Lucas Petit - 3 schedules (STAGE + 2 pour CDI)
    "lucas.petit@example.com": ["STANDARD_10_18", "STANDARD_9_17", "FLEXIBLE_8_30_16_30"],

    // Emma Dubois - 4 schedules (CDD + 3 pour CDI)
    "emma.dubois@example.com": ["STANDARD_8_16", "STANDARD_8_17", "EARLY_7_15", "STANDARD_9_17"],

    // Hugo Moreau - 3 schedules (ALTERNANCE + 2 pour CDI)
    "hugo.moreau@example.com": ["TUESDAY_SAT_9_18", "STANDARD_9_18", "STANDARD_9_17"],

    // Léa Simon - 3 schedules (CDD + 2 pour CDI)
    "lea.simon@example.com": ["STANDARD_9_18", "STANDARD_9_17", "FLEXIBLE_9_17"],

    // Nathan Laurent - 5 schedules (STAGE + CDD + 3 pour CDI)
    "nathan.laurent@example.com": ["STANDARD_10_18", "STANDARD_9_18", "STANDARD_8_17", "STANDARD_8_16", "EARLY_7_15"],

    // Chloé Lefebvre - 3 schedules (STAGE + 2 pour CDD)
    "chloe.lefebvre@example.com": ["TUESDAY_SAT_9_18", "TUESDAY_SAT_8_16", "STANDARD_9_17"],

    // Antoine Roux - 2 schedules (CDD)
    "antoine.roux@example.com": ["STANDARD_9_17", "LATE_10_19"],

    // Camille Garnier - 1 schedule
    "camille.garnier@example.com": ["STANDARD_8_17"],

    // Maxime Faure - 2 schedules (CDD)
    "maxime.faure@example.com": ["TUESDAY_SAT_9_18", "STANDARD_9_17"],

    // Julie Bonnet - 1 schedule
    "julie.bonnet@example.com": ["TUESDAY_SAT_8_16"],

    // Alexandre Rousseau - 1 schedule
    "alexandre.rousseau@example.com": ["STANDARD_10_18"],
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
