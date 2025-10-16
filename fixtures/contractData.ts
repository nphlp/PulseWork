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
    // ADMIN - CDI
    {
        contractType: "CDI",
        startDate: new Date("2020-01-15"),
        endDate: null,
        Employee: { connect: { email: "admin@example.com" } },
    },
    // MANAGERS - CDI
    {
        contractType: "CDI",
        startDate: new Date("2023-06-01"),
        endDate: null,
        Employee: { connect: { email: "manager@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2021-03-01"),
        endDate: null,
        Employee: { connect: { email: "thomas.martin@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2021-09-01"),
        endDate: null,
        Employee: { connect: { email: "marie.bernard@example.com" } },
    },
    // EMPLOYEES
    // CDI (6 employés en CDI)
    {
        contractType: "CDI",
        startDate: new Date("2024-01-10"),
        endDate: null,
        Employee: { connect: { email: "employee@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2022-06-01"),
        endDate: null,
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2022-02-14"),
        endDate: null,
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2023-01-09"),
        endDate: null,
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2023-05-22"),
        endDate: null,
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    {
        contractType: "CDI",
        startDate: new Date("2024-03-11"),
        endDate: null,
        Employee: { connect: { email: "nathan.laurent@example.com" } },
    },
    // CDD (4 employés en CDD de 1 an)
    {
        contractType: "CDD",
        startDate: new Date("2024-10-01"),
        endDate: new Date("2025-09-30"),
        Employee: { connect: { email: "chloe.lefebvre@example.com" } },
    },
    {
        contractType: "CDD",
        startDate: new Date("2024-09-15"),
        endDate: new Date("2025-09-14"),
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },
    {
        contractType: "CDD",
        startDate: new Date("2025-01-02"),
        endDate: new Date("2026-01-01"),
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },
    {
        contractType: "CDD",
        startDate: new Date("2025-02-17"),
        endDate: new Date("2026-02-16"),
        Employee: { connect: { email: "maxime.faure@example.com" } },
    },
    // INTERIM (1 employé)
    {
        contractType: "INTERIM",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-11-30"),
        Employee: { connect: { email: "julie.bonnet@example.com" } },
    },
    // STAGE (1 employé)
    {
        contractType: "STAGE",
        startDate: new Date("2025-04-01"),
        endDate: new Date("2025-09-30"),
        Employee: { connect: { email: "alexandre.rousseau@example.com" } },
    },
];
