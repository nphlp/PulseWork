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

        // Grouper les contrats par email d'employé
        const contractsByEmail = contracts.reduce(
            (acc, contract) => {
                if (!acc[contract.Employee.email]) {
                    acc[contract.Employee.email] = [];
                }
                acc[contract.Employee.email].push(contract);
                return acc;
            },
            {} as Record<string, typeof contracts>,
        );

        // Créer les schedules pour chaque contrat
        const schedulesToCreate = [
            // ADMIN - CDI - 1 schedule stable
            {
                startDate: new Date("2020-01-15"),
                endDate: null,
                contractId: contractsByEmail["admin@example.com"][0].id,
            },

            // MANAGER Generic - CDI - 1 schedule
            {
                startDate: new Date("2023-06-01"),
                endDate: null,
                contractId: contractsByEmail["manager@example.com"][0].id,
            },

            // Thomas Martin - CDD puis CDI
            // CDD
            {
                startDate: new Date("2020-03-01"),
                endDate: new Date("2021-02-28"),
                contractId: contractsByEmail["thomas.martin@example.com"][0].id,
            },
            // CDI - 2 schedules (changement d'horaire en 2023)
            {
                startDate: new Date("2021-03-01"),
                endDate: new Date("2023-08-31"),
                contractId: contractsByEmail["thomas.martin@example.com"][1].id,
            },
            {
                startDate: new Date("2023-09-01"),
                endDate: null,
                contractId: contractsByEmail["thomas.martin@example.com"][1].id,
            },

            // Marie Bernard - STAGE puis CDD puis CDI
            // STAGE
            {
                startDate: new Date("2020-03-01"),
                endDate: new Date("2020-08-31"),
                contractId: contractsByEmail["marie.bernard@example.com"][0].id,
            },
            // CDD
            {
                startDate: new Date("2020-09-01"),
                endDate: new Date("2021-08-31"),
                contractId: contractsByEmail["marie.bernard@example.com"][1].id,
            },
            // CDI
            {
                startDate: new Date("2021-09-01"),
                endDate: null,
                contractId: contractsByEmail["marie.bernard@example.com"][2].id,
            },

            // EMPLOYEE Generic - CDI - 1 schedule
            {
                startDate: new Date("2024-01-10"),
                endDate: null,
                contractId: contractsByEmail["employee@example.com"][0].id,
            },

            // Lucas Petit - STAGE puis CDI
            // STAGE
            {
                startDate: new Date("2021-12-01"),
                endDate: new Date("2022-05-31"),
                contractId: contractsByEmail["lucas.petit@example.com"][0].id,
            },
            // CDI - 2 schedules
            {
                startDate: new Date("2022-06-01"),
                endDate: new Date("2024-05-31"),
                contractId: contractsByEmail["lucas.petit@example.com"][1].id,
            },
            {
                startDate: new Date("2024-06-01"),
                endDate: null,
                contractId: contractsByEmail["lucas.petit@example.com"][1].id,
            },

            // Emma Dubois - CDD puis CDI
            // CDD
            {
                startDate: new Date("2021-02-14"),
                endDate: new Date("2022-02-13"),
                contractId: contractsByEmail["emma.dubois@example.com"][0].id,
            },
            // CDI
            {
                startDate: new Date("2022-02-14"),
                endDate: null,
                contractId: contractsByEmail["emma.dubois@example.com"][1].id,
            },

            // Hugo Moreau - ALTERNANCE (CDD) puis CDI
            // ALTERNANCE
            {
                startDate: new Date("2021-01-09"),
                endDate: new Date("2023-01-08"),
                contractId: contractsByEmail["hugo.moreau@example.com"][0].id,
            },
            // CDI - 2 schedules
            {
                startDate: new Date("2023-01-09"),
                endDate: new Date("2024-12-31"),
                contractId: contractsByEmail["hugo.moreau@example.com"][1].id,
            },
            {
                startDate: new Date("2025-01-01"),
                endDate: null,
                contractId: contractsByEmail["hugo.moreau@example.com"][1].id,
            },

            // Léa Simon - CDD puis CDI
            // CDD
            {
                startDate: new Date("2022-11-22"),
                endDate: new Date("2023-05-21"),
                contractId: contractsByEmail["lea.simon@example.com"][0].id,
            },
            // CDI
            {
                startDate: new Date("2023-05-22"),
                endDate: null,
                contractId: contractsByEmail["lea.simon@example.com"][1].id,
            },

            // Nathan Laurent - STAGE puis CDD puis CDI
            // STAGE
            {
                startDate: new Date("2023-09-11"),
                endDate: new Date("2023-12-10"),
                contractId: contractsByEmail["nathan.laurent@example.com"][0].id,
            },
            // CDD
            {
                startDate: new Date("2023-12-11"),
                endDate: new Date("2024-03-10"),
                contractId: contractsByEmail["nathan.laurent@example.com"][1].id,
            },
            // CDI - 2 schedules
            {
                startDate: new Date("2024-03-11"),
                endDate: new Date("2025-02-28"),
                contractId: contractsByEmail["nathan.laurent@example.com"][2].id,
            },
            {
                startDate: new Date("2025-03-01"),
                endDate: null,
                contractId: contractsByEmail["nathan.laurent@example.com"][2].id,
            },

            // Chloé Lefebvre - STAGE puis CDD
            // STAGE
            {
                startDate: new Date("2024-04-01"),
                endDate: new Date("2024-09-30"),
                contractId: contractsByEmail["chloe.lefebvre@example.com"][0].id,
            },
            // CDD
            {
                startDate: new Date("2024-10-01"),
                endDate: null,
                contractId: contractsByEmail["chloe.lefebvre@example.com"][1].id,
            },

            // Antoine Roux - CDD
            {
                startDate: new Date("2024-09-15"),
                endDate: null,
                contractId: contractsByEmail["antoine.roux@example.com"][0].id,
            },

            // Camille Garnier - CDD
            {
                startDate: new Date("2025-01-02"),
                endDate: null,
                contractId: contractsByEmail["camille.garnier@example.com"][0].id,
            },

            // Maxime Faure - CDD - 2 schedules
            {
                startDate: new Date("2025-02-17"),
                endDate: new Date("2025-08-16"),
                contractId: contractsByEmail["maxime.faure@example.com"][0].id,
            },
            {
                startDate: new Date("2025-08-17"),
                endDate: null,
                contractId: contractsByEmail["maxime.faure@example.com"][0].id,
            },

            // Julie Bonnet - INTERIM
            {
                startDate: new Date("2025-08-01"),
                endDate: null,
                contractId: contractsByEmail["julie.bonnet@example.com"][0].id,
            },

            // Alexandre Rousseau - STAGE
            {
                startDate: new Date("2025-04-01"),
                endDate: null,
                contractId: contractsByEmail["alexandre.rousseau@example.com"][0].id,
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
