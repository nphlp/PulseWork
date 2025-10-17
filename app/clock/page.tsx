import { getClockData } from "@app/clock/components/getClockData";
import { getSession } from "@lib/authServer";
import { redirect } from "next/navigation";
import { ContractScheduleCard } from "./components/ContractScheduleCard";
import { CurrentCheckCard } from "./components/CurrentCheckCard";
import { MissedChecksCard } from "./components/MissedChecksCard";
import { MyScheduleCard } from "./components/MyScheduleCard";
import { RecentChecksCard } from "./components/RecentChecksCard";
import { TimeDebugger } from "./components/TimeDebugger";

type ClockPageProps = {
    searchParams: Promise<{ debugTime?: string }>;
};

export default async function ClockPage({ searchParams }: ClockPageProps) {
    const session = await getSession();
    if (!session) redirect("/login");

    const params = await searchParams;
    const debugTime = params.debugTime;

    const clockData = await getClockData(session.user.id, debugTime);

    if (!clockData.contrat) {
        return (
            <div className="space-y-6 p-7">
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
        <div className="w-full max-w-[1400px] space-y-6 p-7">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Pointage</h1>
                    <p className="text-muted-foreground mt-2">
                        Connectez-vous entre 15 minutes avant et après votre horaire de travail pour pointer.
                    </p>
                </div>
                <TimeDebugger />
            </div>

            <div className="space-y-6">
                <CurrentCheckCard currentDay={clockData.currentDay} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <MyScheduleCard schedule={clockData.days} />
                    <MissedChecksCard missedChecks={clockData.missedChecks} />
                    <RecentChecksCard recentChecks={clockData.recentChecks} />
                </div>

                <ContractScheduleCard contrat={clockData.contrat} schedule={clockData.schedule} />
            </div>
        </div>
    );
}
