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

// Helper function to calculate date with offset
const getDaysAgo = (days: number): Date => {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

// Helper to create standard work week (Monday-Friday, 9h-12h and 13h-17h)
const standardWorkWeek: Prisma.WorkCreateWithoutScheduleInput[] = [
    // MONDAY
    {
        arrivingDay: "MONDAY",
        leavingDay: "MONDAY",
        arriving: "09:00",
        leaving: "12:00",
        pointingArrival: true,
        pointingDeparture: false,
    },
    {
        arrivingDay: "MONDAY",
        leavingDay: "MONDAY",
        arriving: "13:00",
        leaving: "17:00",
        pointingArrival: false,
        pointingDeparture: true,
    },
    // TUESDAY
    {
        arrivingDay: "TUESDAY",
        leavingDay: "TUESDAY",
        arriving: "09:00",
        leaving: "12:00",
        pointingArrival: true,
        pointingDeparture: false,
    },
    {
        arrivingDay: "TUESDAY",
        leavingDay: "TUESDAY",
        arriving: "13:00",
        leaving: "17:00",
        pointingArrival: false,
        pointingDeparture: true,
    },
    // WEDNESDAY
    {
        arrivingDay: "WEDNESDAY",
        leavingDay: "WEDNESDAY",
        arriving: "09:00",
        leaving: "12:00",
        pointingArrival: true,
        pointingDeparture: false,
    },
    {
        arrivingDay: "WEDNESDAY",
        leavingDay: "WEDNESDAY",
        arriving: "13:00",
        leaving: "17:00",
        pointingArrival: false,
        pointingDeparture: true,
    },
    // THURSDAY
    {
        arrivingDay: "THURSDAY",
        leavingDay: "THURSDAY",
        arriving: "09:00",
        leaving: "12:00",
        pointingArrival: true,
        pointingDeparture: false,
    },
    {
        arrivingDay: "THURSDAY",
        leavingDay: "THURSDAY",
        arriving: "13:00",
        leaving: "17:00",
        pointingArrival: false,
        pointingDeparture: true,
    },
    // FRIDAY
    {
        arrivingDay: "FRIDAY",
        leavingDay: "FRIDAY",
        arriving: "09:00",
        leaving: "12:00",
        pointingArrival: true,
        pointingDeparture: false,
    },
    {
        arrivingDay: "FRIDAY",
        leavingDay: "FRIDAY",
        arriving: "13:00",
        leaving: "17:00",
        pointingArrival: false,
        pointingDeparture: true,
    },
];

const contractData: Prisma.ContractCreateInput[] = [
    // ADMINS - Started 120 days ago
    {
        contractType: "CDI",
        startDate: getDaysAgo(120),
        endDate: null,
        Employee: {
            connect: { email: "admin@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(120),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    {
        contractType: "CDI",
        startDate: getDaysAgo(120),
        endDate: null,
        Employee: {
            connect: { email: "sophie.durand@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(120),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    // MANAGERS - Started 90 days ago
    {
        contractType: "CDI",
        startDate: getDaysAgo(90),
        endDate: null,
        Employee: {
            connect: { email: "manager@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(90),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    {
        contractType: "CDI",
        startDate: getDaysAgo(90),
        endDate: null,
        Employee: {
            connect: { email: "thomas.martin@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(90),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    // EMPLOYEES - Started 60 days ago
    {
        contractType: "CDI",
        startDate: getDaysAgo(60),
        endDate: null,
        Employee: {
            connect: { email: "employee@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(60),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    {
        contractType: "CDI",
        startDate: getDaysAgo(60),
        endDate: null,
        Employee: {
            connect: { email: "lucas.petit@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(60),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    {
        contractType: "CDI",
        startDate: getDaysAgo(60),
        endDate: null,
        Employee: {
            connect: { email: "emma.dubois@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(60),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    {
        contractType: "CDI",
        startDate: getDaysAgo(60),
        endDate: null,
        Employee: {
            connect: { email: "hugo.moreau@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(60),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
    {
        contractType: "CDI",
        startDate: getDaysAgo(60),
        endDate: null,
        Employee: {
            connect: { email: "lea.simon@example.com" },
        },
        Schedules: {
            create: {
                startDate: getDaysAgo(60),
                endDate: null,
                Works: {
                    create: standardWorkWeek,
                },
            },
        },
    },
];
