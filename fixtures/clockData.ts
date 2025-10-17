import PrismaInstance from "@lib/prisma";
import { DayOfWeek } from "@prisma/client";

type EmployeeClockingBehavior = {
    email: string;
    arrivalOffset: (number | null)[]; // Minutes de décalage pour les arrivées
    departureOffset: (number | null)[]; // Minutes de décalage pour les départs
};

const employeeBehaviors: EmployeeClockingBehavior[] = [
    // ADMINS - Très assidus, montrent l'exemple
    {
        email: "admin@example.com",
        arrivalOffset: [-10, -8, -12, -5, -15], // Toujours en avance (5-15min)
        departureOffset: [15, 20, 10, 18, 25], // Part toujours plus tard (10-25min)
        // Profil : Leader exemplaire, arrive toujours tôt et part tard, très investi
    },
    {
        email: "sophie.durand@example.com",
        arrivalOffset: [-8, -10, -6, -12], // Toujours en avance (6-12min)
        departureOffset: [12, 18, 15, 20], // Part plus tard (12-20min)
        // Profil : Très professionnelle, ponctuelle et dévouée, arrive tôt chaque jour
    },

    // MANAGERS - Profils variés
    {
        email: "manager@example.com",
        arrivalOffset: [10, 8, 15, 12, 5], // Souvent en retard (5-15min)
        departureOffset: [20, 25, 30, 18, 22], // Compense en partant tard (18-30min)
        // Profil : Manager débordé, souvent en retard le matin (réunions matinales?), compense en soirée
    },
    {
        email: "thomas.martin@example.com",
        arrivalOffset: [-5, -8, 0, -3, 2], // Généralement ponctuel, parfois en avance
        departureOffset: [0, 5, -5, 2, 0], // Part à l'heure ou légèrement en avance/retard
        // Profil : Manager équilibré, respecte ses horaires, vie personnelle équilibrée
    },

    // EMPLOYEES - Profils très variés
    {
        email: "employee@example.com",
        arrivalOffset: [5, null, 3, -2, 0], // Ponctuel mais oublie parfois
        departureOffset: [null, 5, 0, 2, -5], // Oublie aussi le départ parfois
        // Profil : Étourdi mais sympathique, oublie de pointer 1-2 fois par semaine
    },
    {
        email: "lucas.petit@example.com",
        arrivalOffset: [0, 1, -1, 2, 0], // Très ponctuel (±2min max)
        departureOffset: [0, -2, 1, 0, 3], // Très ponctuel (±3min max)
        // Profil : Le fiable, toujours pile à l'heure, très régulier et prévisible
    },
    {
        email: "emma.dubois@example.com",
        arrivalOffset: [8, 10, 6, 12, null], // Souvent en retard (6-12min), oublie parfois
        departureOffset: [5, 8, 10, null, 6], // Part un peu en retard aussi, oublie parfois
        // Profil : La retardataire chronique, toujours 5-10min de retard, détendue
    },
    {
        email: "hugo.moreau@example.com",
        arrivalOffset: [-5, -3, 0, -2, -6], // Toujours en avance (0-6min)
        departureOffset: [10, 8, 12, 6, 15], // Part plus tard (6-15min)
        // Profil : L'ambitieux, arrive toujours en avance et part plus tard, très motivé
    },
    {
        email: "lea.simon@example.com",
        arrivalOffset: [3, 5, null, 2, 4], // Léger retard (2-5min), oublie occasionnellement
        departureOffset: [2, 0, 5, null, 3], // À l'heure au départ, oublie occasionnellement
        // Profil : La discrète, légèrement en retard le matin mais compense, oublie parfois
    },
];

// Map JavaScript day (0=Sunday, 1=Monday) to DayOfWeek enum
const dayNumberToDayOfWeek = (dayNumber: number): DayOfWeek => {
    const mapping: Record<number, DayOfWeek> = {
        0: "SUNDAY",
        1: "MONDAY",
        2: "TUESDAY",
        3: "WEDNESDAY",
        4: "THURSDAY",
        5: "FRIDAY",
        6: "SATURDAY",
    };
    return mapping[dayNumber];
};

// Parse time string "09:00" and add to date with offset in minutes
const addTimeWithOffset = (date: Date, timeString: string, offsetMinutes: number): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes + offsetMinutes, 0, 0);
    return result;
};

export const insertClocks = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const behavior of employeeBehaviors) {
            // Get user with contract, schedule, and works
            const user = await PrismaInstance.user.findUnique({
                where: { email: behavior.email },
                include: {
                    Contracts: {
                        include: {
                            Schedules: {
                                include: {
                                    Works: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!user || user.Contracts.length === 0) continue;

            // Get the first contract (assuming one active contract per user)
            const contract = user.Contracts[0];
            const contractStartDate = new Date(contract.startDate);
            contractStartDate.setHours(0, 0, 0, 0);

            // Calculate days since contract start
            const daysSinceStart = Math.floor((today.getTime() - contractStartDate.getTime()) / (1000 * 60 * 60 * 24));

            // Loop through each day from contract start to today
            for (let dayOffset = 0; dayOffset <= daysSinceStart; dayOffset++) {
                const currentDate = new Date(contractStartDate);
                currentDate.setDate(contractStartDate.getDate() + dayOffset);

                const dayOfWeek = dayNumberToDayOfWeek(currentDate.getDay());

                // Find works for this day of week
                const schedule = contract.Schedules[0]; // Assuming one active schedule
                if (!schedule) continue;

                const worksForDay = schedule.Works.filter((work) => work.arrivingDay === dayOfWeek);

                for (const work of worksForDay) {
                    // Handle arrival clock
                    if (work.pointingArrival) {
                        const arrivalIndex = dayOffset % behavior.arrivalOffset.length;
                        const arrivalOffsetValue = behavior.arrivalOffset[arrivalIndex];

                        if (arrivalOffsetValue !== null) {
                            const clockTime = addTimeWithOffset(currentDate, work.arriving, arrivalOffsetValue);

                            await PrismaInstance.clock.create({
                                data: {
                                    date: clockTime,
                                    checkType: "CHECKIN",
                                    employeeId: user.id,
                                },
                            });
                        }
                    }

                    // Handle departure clock
                    if (work.pointingDeparture) {
                        const departureIndex = dayOffset % behavior.departureOffset.length;
                        const departureOffsetValue = behavior.departureOffset[departureIndex];

                        if (departureOffsetValue !== null) {
                            const clockTime = addTimeWithOffset(currentDate, work.leaving, departureOffsetValue);

                            await PrismaInstance.clock.create({
                                data: {
                                    date: clockTime,
                                    checkType: "CHECKOUT",
                                    employeeId: user.id,
                                },
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des pointages -> " + (error as Error).message);
    }
};
