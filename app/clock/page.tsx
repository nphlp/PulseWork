import { getClockData } from "@app/clock/components/getClockData";
import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import { CurrentCheckCard } from "./components/CurrentCheckCard";
import { MissedChecksCard } from "./components/MissedChecksCard";
import { MyScheduleCard } from "./components/MyScheduleCard";
import { RecentChecksCard } from "./components/RecentChecksCard";

export default async function ClockPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const clockData = await getClockData(session.user.id);

    if (!clockData.contrat) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">Vous n&apos;avez pas encore de contrat actif</h2>
                        <p className="text-muted-foreground mt-2">
                            Contactez votre manager pour plus d&apos;informations.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!clockData.schedule || !clockData.days) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex min-h-[400px] items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">Aucun planning configuré</h2>
                        <p className="text-muted-foreground mt-2">
                            Contactez votre manager pour configurer vos horaires de travail.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Pointage</h1>
                <p className="text-muted-foreground mt-2">Gérez vos pointages quotidiens</p>
            </div>

            <div className="space-y-6">
                <CurrentCheckCard currentDay={clockData.currentDay} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <MyScheduleCard schedule={clockData.days} />
                    <MissedChecksCard missedChecks={clockData.missedChecks} />
                    <RecentChecksCard recentChecks={clockData.recentChecks} />
                </div>
            </div>
        </div>
    );
}
