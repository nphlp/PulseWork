import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";

export const insertContracts = async () => {
    try {
        for (const data of contractData) {
            await PrismaInstance.contract.create({ data });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des contrats -> " + (error as Error).message);
    }
};

export const contractData: Prisma.ContractCreateInput[] = [
    // ADMIN - CDI direct (ancienneté)
    {
        contractType: "CDI",
        startDate: new Date("2020-01-15"),
        endDate: null,
        Employee: { connect: { email: "admin@example.com" } },
    },

    // MANAGERS
    // Manager Generic - CDI direct
    {
        contractType: "CDI",
        startDate: new Date("2023-06-01"),
        endDate: null,
        Employee: { connect: { email: "manager@example.com" } },
    },

    // Thomas Martin - CDD puis CDI
    {
        contractType: "CDD",
        startDate: new Date("2020-03-01"),
        endDate: new Date("2021-02-28"),
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2021-03-01"),
        endDate: null,
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },

    // Marie Bernard - STAGE puis CDD puis CDI
    {
        contractType: "STAGE",
        startDate: new Date("2020-03-01"),
        endDate: new Date("2020-08-31"),
        Employee: { connect: { email: "marie.bernard@example.com" } },
    },
    {
        contractType: "CDD",
        startDate: new Date("2020-09-01"),
        endDate: new Date("2021-08-31"),
        Employee: { connect: { email: "marie.bernard@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2021-09-01"),
        endDate: null,
        Employee: { connect: { email: "marie.bernard@example.com" } },
    },

    // EMPLOYEES
    // Employee Generic - CDI direct
    {
        contractType: "CDI",
        startDate: new Date("2024-01-10"),
        endDate: null,
        Employee: { connect: { email: "employee@example.com" } },
    },

    // Lucas Petit - STAGE puis CDI
    {
        contractType: "STAGE",
        startDate: new Date("2021-12-01"),
        endDate: new Date("2022-05-31"),
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2022-06-01"),
        endDate: null,
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },

    // Emma Dubois - CDD puis CDI
    {
        contractType: "CDD",
        startDate: new Date("2021-02-14"),
        endDate: new Date("2022-02-13"),
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2022-02-14"),
        endDate: null,
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },

    // Hugo Moreau - ALTERNANCE puis CDI
    {
        contractType: "CDD", // Contrat d'alternance = CDD
        startDate: new Date("2021-01-09"),
        endDate: new Date("2023-01-08"),
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2023-01-09"),
        endDate: null,
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },

    // Léa Simon - CDD puis CDI
    {
        contractType: "CDD",
        startDate: new Date("2022-11-22"),
        endDate: new Date("2023-05-21"),
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2023-05-22"),
        endDate: null,
        Employee: { connect: { email: "lea.simon@example.com" } },
    },

    // Nathan Laurent - STAGE puis CDD puis CDI
    {
        contractType: "STAGE",
        startDate: new Date("2023-09-11"),
        endDate: new Date("2023-12-10"),
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        contractType: "CDD",
        startDate: new Date("2023-12-11"),
        endDate: new Date("2024-03-10"),
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2024-03-11"),
        endDate: null,
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },

    // Chloé Lefebvre - STAGE puis CDD (actuel)
    {
        contractType: "STAGE",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-09-30"),
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        contractType: "CDD",
        startDate: new Date("2024-10-01"),
        endDate: new Date("2025-09-30"),
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },

    // Antoine Roux - CDD actuel
    {
        contractType: "CDD",
        startDate: new Date("2024-09-15"),
        endDate: new Date("2025-09-14"),
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },

    // Camille Garnier - CDD actuel
    {
        contractType: "CDD",
        startDate: new Date("2025-01-02"),
        endDate: new Date("2026-01-01"),
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },

    // Maxime Faure - CDD actuel
    {
        contractType: "CDD",
        startDate: new Date("2025-02-17"),
        endDate: new Date("2026-02-16"),
        Employee: { connect: { email: "maxime.faure@example.com" } },
    },

    // Julie Bonnet - INTERIM actuel
    {
        contractType: "INTERIM",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-11-30"),
        Employee: { connect: { email: "julie.bonnet@example.com" } },
    },

    // Alexandre Rousseau - STAGE actuel
    {
        contractType: "STAGE",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-09-30"),
        Employee: { connect: { email: "alexandre.rousseau@example.com" } },
    },
];
