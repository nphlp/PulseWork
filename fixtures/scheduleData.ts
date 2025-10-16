import PrismaInstance from "@lib/prisma";

/**
 * Récupère tous les contrats avec leurs informations
 */
const getContracts = async () => {
    return await PrismaInstance.contract.findMany({
        include: {
            Employee: true,
        },
        orderBy: {
            startDate: "asc",
        },
    });
};

/**
 * Insère les schedules dans la base de données
 */
export const insertSchedules = async () => {
    try {
        const contracts = await getContracts();

        // Mapper les contrats par email pour faciliter l'accès
        const contractByEmail = contracts.reduce(
            (acc, contract) => {
                acc[contract.Employee.email] = contract;
                return acc;
            },
            {} as Record<string, (typeof contracts)[0]>,
        );

        // Créer les schedules pour chaque employé
        const schedulesToCreate = [
            // ADMIN - 1 schedule stable depuis le début
            {
                startDate: new Date("2020-01-15"),
                endDate: null,
                contractId: contractByEmail["admin@example.com"].id,
            },
            // MANAGER Generic - 1 schedule
            {
                startDate: new Date("2023-06-01"),
                endDate: null,
                contractId: contractByEmail["manager@example.com"].id,
            },
            // MANAGER 1 (Thomas) - 2 schedules (changement d'horaire en 2023)
            {
                startDate: new Date("2021-03-01"),
                endDate: new Date("2023-08-31"),
                contractId: contractByEmail["thomas.martin@example.com"].id,
            },
            {
                startDate: new Date("2023-09-01"),
                endDate: null,
                contractId: contractByEmail["thomas.martin@example.com"].id,
            },
            // MANAGER 2 - 1 schedule stable
            {
                startDate: new Date("2021-09-01"),
                endDate: null,
                contractId: contractByEmail["marie.bernard@example.com"].id,
            },
            // EMPLOYEE Generic - 1 schedule
            {
                startDate: new Date("2024-01-10"),
                endDate: null,
                contractId: contractByEmail["employee@example.com"].id,
            },
            // EMPLOYEE 1 (Lucas) - 2 schedules
            {
                startDate: new Date("2022-06-01"),
                endDate: new Date("2024-05-31"),
                contractId: contractByEmail["lucas.petit@example.com"].id,
            },
            {
                startDate: new Date("2024-06-01"),
                endDate: null,
                contractId: contractByEmail["lucas.petit@example.com"].id,
            },
            // EMPLOYEE 2 (Emma) - 1 schedule
            {
                startDate: new Date("2022-02-14"),
                endDate: null,
                contractId: contractByEmail["emma.dubois@example.com"].id,
            },
            // EMPLOYEE 3 (Hugo) - 2 schedules
            {
                startDate: new Date("2023-01-09"),
                endDate: new Date("2024-12-31"),
                contractId: contractByEmail["hugo.moreau@example.com"].id,
            },
            {
                startDate: new Date("2025-01-01"),
                endDate: null,
                contractId: contractByEmail["hugo.moreau@example.com"].id,
            },
            // EMPLOYEE 4 (Léa) - 1 schedule
            {
                startDate: new Date("2023-05-22"),
                endDate: null,
                contractId: contractByEmail["lea.simon@example.com"].id,
            },
            // EMPLOYEE 5 (Nathan) - 2 schedules
            {
                startDate: new Date("2024-03-11"),
                endDate: new Date("2025-02-28"),
                contractId: contractByEmail["nathan.laurent@example.com"].id,
            },
            {
                startDate: new Date("2025-03-01"),
                endDate: null,
                contractId: contractByEmail["nathan.laurent@example.com"].id,
            },
            // EMPLOYEE 6 (Chloé) - CDD - 1 schedule
            {
                startDate: new Date("2024-10-01"),
                endDate: null,
                contractId: contractByEmail["chloe.lefebvre@example.com"].id,
            },
            // EMPLOYEE 7 (Antoine) - CDD - 1 schedule
            {
                startDate: new Date("2024-09-15"),
                endDate: null,
                contractId: contractByEmail["antoine.roux@example.com"].id,
            },
            // EMPLOYEE 8 (Camille) - CDD - 1 schedule
            {
                startDate: new Date("2025-01-02"),
                endDate: null,
                contractId: contractByEmail["camille.garnier@example.com"].id,
            },
            // EMPLOYEE 9 (Maxime) - CDD - 2 schedules
            {
                startDate: new Date("2025-02-17"),
                endDate: new Date("2025-08-16"),
                contractId: contractByEmail["maxime.faure@example.com"].id,
            },
            {
                startDate: new Date("2025-08-17"),
                endDate: null,
                contractId: contractByEmail["maxime.faure@example.com"].id,
            },
            // EMPLOYEE 10 (Julie) - INTERIM - 1 schedule
            {
                startDate: new Date("2025-08-01"),
                endDate: null,
                contractId: contractByEmail["julie.bonnet@example.com"].id,
            },
            // EMPLOYEE 11 (Alexandre) - STAGE - 1 schedule
            {
                startDate: new Date("2025-04-01"),
                endDate: null,
                contractId: contractByEmail["alexandre.rousseau@example.com"].id,
            },
        ];

        // Insérer tous les schedules
        for (const scheduleData of schedulesToCreate) {
            await PrismaInstance.schedule.create({
                data: scheduleData,
            });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des schedules -> " + (error as Error).message);
    }
};
