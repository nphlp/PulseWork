import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";

export const insertTeams = async () => {
    try {
        for (const data of teamData) {
            await PrismaInstance.team.create({ data });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des équipes -> " + (error as Error).message);
    }
};

export const teamData: Prisma.TeamCreateInput[] = [
    // Équipe Phoenix - Manager Generic
    {
        name: "Phoenix",
        Manager: { connect: { email: "manager@example.com" } },
        Members: {
            create: [
                { User: { connect: { email: "employee@example.com" } } },
                { User: { connect: { email: "lucas.petit@example.com" } } },
                { User: { connect: { email: "emma.dubois@example.com" } } },
                { User: { connect: { email: "hugo.moreau@example.com" } } },
            ],
        },
    },

    // Équipe Dragon - Thomas Martin
    {
        name: "Dragon",
        Manager: { connect: { email: "thomas.martin@example.com" } },
        Members: {
            create: [
                { User: { connect: { email: "lea.simon@example.com" } } },
                { User: { connect: { email: "nathan.laurent@example.com" } } },
                { User: { connect: { email: "chloe.lefebvre@example.com" } } },
                { User: { connect: { email: "antoine.roux@example.com" } } },
            ],
        },
    },

    // Équipe Kraken - Marie Bernard
    {
        name: "Kraken",
        Manager: { connect: { email: "marie.bernard@example.com" } },
        Members: {
            create: [
                { User: { connect: { email: "camille.garnier@example.com" } } },
                { User: { connect: { email: "maxime.faure@example.com" } } },
                { User: { connect: { email: "julie.bonnet@example.com" } } },
                { User: { connect: { email: "alexandre.rousseau@example.com" } } },
            ],
        },
    },
];
