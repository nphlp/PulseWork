import PrismaInstance from "@lib/prisma";
import { Prisma } from "@prisma/client";

export const insertUsers = async () => {
    try {
        for (const data of userData) {
            // Creer l'utilisateur et son compte
            const { id, Account } = await PrismaInstance.user.create({ data, include: { Account: true } });

            // Copier l'id de l'utilisateur dans l'accountId pour correspondre aux spécifications de BetterAuth
            await PrismaInstance.account.update({
                where: { id: Account[0].id },
                data: {
                    accountId: id,
                },
            });
        }
    } catch (error) {
        throw new Error("❌ Erreur lors de la création des utilisateurs -> " + (error as Error).message);
    }
};

const defaultPassword =
    "90e263724fdae11e158546bb8fe3e245:aa3cff1d8e5069c3697e8ea9e9adcfc6106b1f9abd31ebbf571843316cc48a21b289926b37b1ae55866a366fec84ed4fbe7af8ad9af66fa4c2977a694a13fdb1"; // Password1234!

export const userData: Prisma.UserCreateInput[] = [
    // ADMIN
    {
        name: "Sophie",
        lastname: "Durand",
        email: "admin@example.com",
        emailVerified: true,
        role: "ADMIN",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    // MANAGERS
    {
        name: "Manager",
        lastname: "Generic",
        email: "manager@example.com",
        emailVerified: true,
        role: "MANAGER",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Thomas",
        lastname: "Martin",
        email: "thomas.martin@example.com",
        emailVerified: true,
        role: "MANAGER",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Marie",
        lastname: "Bernard",
        email: "marie.bernard@example.com",
        emailVerified: true,
        role: "MANAGER",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    // EMPLOYEES
    {
        name: "Employee",
        lastname: "Generic",
        email: "employee@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Lucas",
        lastname: "Petit",
        email: "lucas.petit@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Emma",
        lastname: "Dubois",
        email: "emma.dubois@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Hugo",
        lastname: "Moreau",
        email: "hugo.moreau@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Léa",
        lastname: "Simon",
        email: "lea.simon@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Nathan",
        lastname: "Laurent",
        email: "nathan.laurent@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Chloé",
        lastname: "Lefebvre",
        email: "chloe.lefebvre@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Antoine",
        lastname: "Roux",
        email: "antoine.roux@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Camille",
        lastname: "Garnier",
        email: "camille.garnier@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Maxime",
        lastname: "Faure",
        email: "maxime.faure@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Julie",
        lastname: "Bonnet",
        email: "julie.bonnet@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
    {
        name: "Alexandre",
        lastname: "Rousseau",
        email: "alexandre.rousseau@example.com",
        emailVerified: true,
        role: "EMPLOYEE",
        Account: {
            create: {
                providerId: "credential",
                accountId: "",
                password: defaultPassword,
            },
        },
    },
];
