import PrismaInstance from "@lib/prisma";
import { insertClocks, insertContracts, insertTeams, insertUsers } from "./index";

/**
 * Commandes pour la gestion des données de test (fixtures)
 *
 * Ce module fournit des fonctions pour:
 * - Charger des données de test initiales dans la base de données
 * - Réinitialiser la base de données
 * - Recharger entièrement les données (reset + fixtures)
 */

/**
 * Vérifie si des données existent dans la base de données
 *
 * @returns Object contenant les informations sur les tables et leurs données
 */
const checkExistingData = async () => {
    try {
        // Récupérer toutes les tables de la base de données
        const tables = await PrismaInstance.$queryRaw<Array<{ table_name: string }>>`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            AND table_name NOT LIKE '_prisma%'
        `;

        const tableData: Record<string, number> = {};
        let totalRecords = 0;

        // Pour chaque table, compter le nombre d'enregistrements
        for (const table of tables) {
            const tableName = table.table_name;

            try {
                const count = await PrismaInstance.$queryRawUnsafe<Array<{ count: bigint }>>(
                    `SELECT COUNT(*) as count FROM "${tableName}"`,
                );

                const recordCount = Number(count[0].count);
                tableData[tableName] = recordCount;
                totalRecords += recordCount;
            } catch {
                console.warn(`⚠️ Impossible to count the records of the table ${tableName}`);
                tableData[tableName] = 0;
            }
        }

        return {
            tables: tableData,
            totalRecords,
            hasData: totalRecords > 0,
        };
    } catch (error) {
        console.error("❌ Error during data check:", error);
        return {
            tables: {},
            totalRecords: 0,
            hasData: false,
        };
    }
};

/**
 * Charge toutes les données de test dans la base de données
 *
 * Crée dans l'ordre:
 * 1. Utilisateurs et comptes
 * 2. Tâches
 *
 * @returns true si les données ont été chargées avec succès, false sinon
 */
export const fixtures = async () => {
    try {
        console.log("🔍 Checking existing data...");
        const dataCheck = await checkExistingData();

        if (dataCheck.hasData) {
            console.log("📊 Data already exists:");
            console.table(dataCheck.tables);
            console.log(`📈 Total: ${dataCheck.totalRecords} records`);
            console.log("ℹ️ Data already exists, skipping fixtures");
            return;
        }

        console.log("🔍 Inserting data...\n");

        // Exécuter les insertions dans l'ordre des dépendances
        await insertUsers();
        await insertTeams();
        await insertContracts();
        await insertClocks();

        // Show summary of created data
        const finalCheck = await checkExistingData();
        console.log("📊 Inserted data:");
        console.table(finalCheck.tables);
        console.log(`📈 Total: ${finalCheck.totalRecords} records`);

        console.log("✅ Fixtures created successfully");
    } catch (error) {
        console.error((error as Error).message);
    }
};

/**
 * Supprime toutes les données des tables principales
 *
 * Nettoie la base de données en supprimant les données dans l'ordre
 * pour respecter les contraintes de clés étrangères.
 *
 * @returns true si le nettoyage a réussi, false sinon
 */
export const reset = async () => {
    try {
        // Supprimer dans l'ordre inverse des dépendances
        await PrismaInstance.clock.deleteMany({});
        await PrismaInstance.contract.deleteMany({});
        await PrismaInstance.teamMember.deleteMany({});
        await PrismaInstance.team.deleteMany({});
        await PrismaInstance.verification.deleteMany({});
        await PrismaInstance.session.deleteMany({});
        await PrismaInstance.account.deleteMany({});
        await PrismaInstance.user.deleteMany({});

        console.log("✅ Database reset successfully");
    } catch (error) {
        console.error((error as Error).message);
    }
};

/**
 * Recharge complètement les données (reset + fixtures)
 *
 * Effectue un nettoyage complet de la base puis recharge
 * toutes les données de test dans l'ordre approprié.
 *
 * @returns true si l'opération complète a réussi, false sinon
 */
export const reload = async () => {
    await reset();
    await fixtures();
};
