import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Génère des pointages pour les derniers jours de travail
 */
export const insertClocks = async () => {
    try {
        for (const data of clockData) {
            await PrismaInstance.clock.create({ data });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des pointages -> " + (error as Error).message);
    }
};

export const clockData: Prisma.ClockCreateInput[] = [
    // Pointages de la semaine du 14-18 octobre 2025
    // Lundi 14 octobre
    {
        date: new Date("2025-10-14T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-14T08:58:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },

    // Mardi 15 octobre
    {
        date: new Date("2025-10-15T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-15T08:55:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:20:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "marie.bernard@example.com" } },
    },

    // Mercredi 16 octobre (aujourd'hui)
    {
        date: new Date("2025-10-16T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-16T08:59:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:15:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:07:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-16T08:45:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },
];
