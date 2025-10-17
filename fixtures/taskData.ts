import PrismaInstance from "@lib/prisma";
import { stringToSlug } from "@utils/stringToSlug";

export const insertTasks = async () => {
    try {
        // Récupérer tous les utilisateurs
        const users = await PrismaInstance.user.findMany();

        // Insérer toutes les tâches en une seule fois
        await PrismaInstance.task.createMany({
            data: users.flatMap((user, index) =>
                taskData.map((task) => ({
                    title: `${task.title} - ${index}`,
                    slug: stringToSlug(`${task.title} - ${index}`),
                    status: task.status,
                    authorId: user.id,
                })),
            ),
        });
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des tâches -> " + (error as Error).message);
    }
};

const taskData = [
    // TODO
    {
        title: "Configurer l'environnement de développement",
        status: "TODO" as const,
    },
    {
        title: "Rédiger la documentation technique",
        status: "TODO" as const,
    },
    {
        title: "Préparer la présentation client",
        status: "TODO" as const,
    },
    // IN_PROGRESS
    {
        title: "Développer l'API de gestion des utilisateurs",
        status: "IN_PROGRESS" as const,
    },
    {
        title: "Implémenter le système d'authentification",
        status: "IN_PROGRESS" as const,
    },
    {
        title: "Créer les tests unitaires du module principal",
        status: "IN_PROGRESS" as const,
    },
    // DONE
    {
        title: "Finaliser la maquette de l'interface",
        status: "DONE" as const,
    },
    {
        title: "Corriger les bugs de la version précédente",
        status: "DONE" as const,
    },
    {
        title: "Déployer l'environnement de staging",
        status: "DONE" as const,
    },
];
