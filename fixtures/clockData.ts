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

/**
 * Génère des pointages variés pour plusieurs semaines
 * Inclut : à l'heure, en avance, légers retards, gros retards
 */
export const clockData: Prisma.ClockCreateInput[] = [
    // ========================================
    // SEMAINE 1 : 30 septembre - 4 octobre 2025
    // ========================================
    // Lundi 30 septembre
    {
        date: new Date("2025-09-30T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-09-30T08:58:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-09-30T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-09-30T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-09-30T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-09-30T08:55:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-09-30T09:15:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-09-30T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-09-30T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-09-30T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // Mardi 1 octobre
    {
        date: new Date("2025-10-01T08:55:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:20:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:07:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        date: new Date("2025-10-01T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },

    // Mercredi 2 octobre
    {
        date: new Date("2025-10-02T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:25:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-02T08:58:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-02T09:15:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // Jeudi 3 octobre
    {
        date: new Date("2025-10-03T08:58:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:18:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-03T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        date: new Date("2025-10-03T08:55:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },

    // Vendredi 4 octobre
    {
        date: new Date("2025-10-04T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:07:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:20:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:13:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-04T09:25:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // ========================================
    // SEMAINE 2 : 7-11 octobre 2025
    // ========================================
    // Lundi 7 octobre
    {
        date: new Date("2025-10-07T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-07T08:58:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:15:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-07T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // Mardi 8 octobre
    {
        date: new Date("2025-10-08T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:07:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:22:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-08T09:18:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        date: new Date("2025-10-08T08:52:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },

    // Mercredi 9 octobre
    {
        date: new Date("2025-10-09T08:57:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-09T09:30:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // Jeudi 10 octobre
    {
        date: new Date("2025-10-10T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:15:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:17:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        date: new Date("2025-10-10T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },

    // Vendredi 11 octobre
    {
        date: new Date("2025-10-11T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:25:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-11T09:20:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // ========================================
    // SEMAINE 3 : 14-16 octobre 2025 (semaine actuelle)
    // ========================================
    // Lundi 14 octobre
    {
        date: new Date("2025-10-14T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-14T08:58:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:07:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-14T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // Mardi 15 octobre
    {
        date: new Date("2025-10-15T09:02:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:05:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-15T08:55:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:10:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:15:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:20:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-15T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        date: new Date("2025-10-15T08:50:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },

    // Mercredi 16 octobre (aujourd'hui)
    {
        date: new Date("2025-10-16T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "admin@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:03:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:08:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:07:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:00:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        date: new Date("2025-10-16T08:59:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:12:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:01:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:15:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        date: new Date("2025-10-16T09:25:00"),
        checkType: "CHECKIN",
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },
];
