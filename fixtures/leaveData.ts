import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";

export const insertLeaves = async () => {
    try {
        for (const data of leaveData) {
            await PrismaInstance.leave.create({ data });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des congés -> " + (error as Error).message);
    }
};

export const leaveData: Prisma.LeaveCreateInput[] = [
    // Congés payés - APPROVED
    {
        leaveType: "CP",
        status: "APPROVED",
        startDate: new Date("2025-07-15"),
        endDate: new Date("2025-07-31"),
        Employee: { connect: { email: "lucas.petit@example.com" } },
    },
    // RTT - APPROVED
    {
        leaveType: "RTT",
        status: "APPROVED",
        startDate: new Date("2025-11-04"),
        endDate: new Date("2025-11-04"),
        Employee: { connect: { email: "emma.dubois@example.com" } },
    },
    // Congés payés - PENDING
    {
        leaveType: "CP",
        status: "PENDING",
        startDate: new Date("2025-12-20"),
        endDate: new Date("2026-01-05"),
        Employee: { connect: { email: "marie.bernard@example.com" } },
    },
    // Maladie - APPROVED
    {
        leaveType: "MALADIE",
        status: "APPROVED",
        startDate: new Date("2025-09-10"),
        endDate: new Date("2025-09-12"),
        Employee: { connect: { email: "hugo.moreau@example.com" } },
    },
    // Sans solde - PENDING
    {
        leaveType: "SANS_SOLDE",
        status: "PENDING",
        startDate: new Date("2025-11-15"),
        endDate: new Date("2025-11-22"),
        Employee: { connect: { email: "antoine.roux@example.com" } },
    },
    // RTT - APPROVED
    {
        leaveType: "RTT",
        status: "APPROVED",
        startDate: new Date("2025-10-31"),
        endDate: new Date("2025-10-31"),
        Employee: { connect: { email: "lea.simon@example.com" } },
    },
    // Congés payés - REJECTED
    {
        leaveType: "CP",
        status: "REJECTED",
        startDate: new Date("2025-08-01"),
        endDate: new Date("2025-08-15"),
        Employee: { connect: { email: "camille.garnier@example.com" } },
    },
];
