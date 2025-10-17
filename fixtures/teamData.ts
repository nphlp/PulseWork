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

const teamData: Prisma.TeamCreateInput[] = [
    {
        name: "Équipe Alpha",
        Manager: {
            connect: { email: "manager@example.com" },
        },
        Members: {
            create: [
                { User: { connect: { email: "employee@example.com" } } },
                { User: { connect: { email: "lucas.petit@example.com" } } },
                { User: { connect: { email: "emma.dubois@example.com" } } },
            ],
        },
    },
    {
        name: "Équipe Beta",
        Manager: {
            connect: { email: "thomas.martin@example.com" },
        },
        Members: {
            create: [
                { User: { connect: { email: "employee@example.com" } } },
                { User: { connect: { email: "hugo.moreau@example.com" } } },
                { User: { connect: { email: "lea.simon@example.com" } } },
            ],
        },
    },
];
