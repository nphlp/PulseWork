/**
 * Migration manuelle : USER -> EMPLOYEE
 *
 * Ce script migre tous les utilisateurs avec le rôle USER vers EMPLOYEE.
 * À exécuter après avoir déployé la migration qui ajoute EMPLOYEE/MANAGER,
 * et avant de supprimer le rôle USER.
 *
 * Usage:
 *   pnpm tsx prisma/manual_migrations/0001_migrate_user_to_employee.ts
 */
import PrismaInstance from "../../lib/prisma";

async function migrateUserToEmployee() {
    console.log("🔄 Début de la migration USER -> EMPLOYEE\n");

    try {
        // Compter les users avec le rôle USER
        const userCount = await PrismaInstance.user.count({
            where: { role: "USER" },
        });

        console.log(`📊 Nombre d'utilisateurs avec le rôle USER : ${userCount}`);

        if (userCount === 0) {
            console.log("✅ Aucun utilisateur à migrer. La migration est déjà complète.");
            return;
        }

        // Mise à jour de tous les USER vers EMPLOYEE
        const result = await PrismaInstance.user.updateMany({
            where: { role: "USER" },
            data: { role: "EMPLOYEE" },
        });

        console.log(`\n✅ Migration réussie !`);
        console.log(`   ${result.count} utilisateur(s) migré(s) de USER vers EMPLOYEE\n`);

        // Vérification post-migration
        const remainingUsers = await PrismaInstance.user.count({
            where: { role: "USER" },
        });

        if (remainingUsers === 0) {
            console.log("✅ Vérification : Aucun utilisateur avec le rôle USER restant");
            console.log("\n🎉 La migration est complète. Vous pouvez maintenant :");
            console.log("   1. Créer une nouvelle migration Prisma qui supprime USER de l'enum Role");
            console.log("   2. Déployer cette migration finale\n");
        } else {
            console.warn(`⚠️  Attention : ${remainingUsers} utilisateur(s) avec le rôle USER restant`);
        }
    } catch (error) {
        console.error("\n❌ Erreur lors de la migration :");
        console.error(error);
        process.exit(1);
    } finally {
        await PrismaInstance.$disconnect();
    }
}

// Exécution du script
migrateUserToEmployee();
