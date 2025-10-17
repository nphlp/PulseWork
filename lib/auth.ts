import EmailTemplate from "@comps/UI/email";
import PrismaInstance from "@lib/prisma";
import { UserFindUniqueAction } from "@services/actions/UserAction";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";
import SendEmailAction from "@/actions/SendEmailAction";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!NEXT_PUBLIC_BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_URL environment variable is not defined");
}

export const auth = betterAuth({
    database: prismaAdapter(PrismaInstance, {
        provider: "postgresql",
    }),
    trustedOrigins: [NEXT_PUBLIC_BASE_URL],
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }: { user: { email: string; name: string }; url: string }) => {
            await SendEmailAction({
                subject: `Reset your password`,
                email: user.email,
                body: EmailTemplate({ buttonUrl: url, emailType: "reset" }),
            });
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            await SendEmailAction({
                subject: `Welcome ${user.name}! Let's verify your email.`,
                email: user.email,
                body: EmailTemplate({ buttonUrl: url, emailType: "verification" }),
            });
        },
    },
    // user: {
    //     changeEmail: {
    //         enabled: true,
    //         sendChangeEmailVerification: async ({ newEmail, url, user }) => {
    //             await SendEmailAction({
    //                 subject: `Hey ${user.name}! Let's verify your new email.`,
    //                 email: newEmail,
    //                 body: EmailTemplate({ buttonUrl: url, emailType: "change" }),
    //             });
    //         },
    //     },
    // },
    session: {
        expiresIn: 60 * 60 * 24, // 24 hours
        updateAge: 60 * 20, // 20 minutes
    },
    plugins: [
        // Extends session with role and lastname
        customSession(async ({ session, user }) => {
            const userData = await UserFindUniqueAction({ where: { id: user.id } });

            if (!userData) {
                throw new Error("User not found");
            }

            const extendedSession = {
                user: {
                    ...user,
                    lastname: userData.lastname,
                    role: userData.role,
                },
                session,
            };

            return extendedSession;
        }),
        // For functions like signInEmail, signUpEmail, etc.
        // Must be the last plugin in the array
        nextCookies(),
    ],
});
