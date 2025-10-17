import { ContratPeriod, SchedulePeriod } from "@app/clock/components/getClockData";
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/ui/card";
import dayjs from "dayjs";
import "dayjs/locale/fr";

type ContractScheduleCardProps = {
    contrat: ContratPeriod | null;
    schedule: SchedulePeriod | null;
};

export function ContractScheduleCard({ contrat, schedule }: ContractScheduleCardProps) {
    const formatDate = (date: Date) => dayjs(date).locale("fr").format("D MMM YYYY");

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Card className="gap-1">
                <CardHeader>
                    <CardTitle>Contrat actuel</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        {contrat?.to
                            ? `Du ${formatDate(contrat.from)} au ${formatDate(contrat.to)}`
                            : `A partir du ${formatDate(contrat!.from)} (en cours)`}
                    </p>
                </CardContent>
            </Card>
            <Card className="gap-1">
                <CardHeader>
                    <CardTitle>Planning actuel</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">
                        {schedule?.to
                            ? `Du ${formatDate(schedule.from)} au ${formatDate(schedule.to)}`
                            : `A partir du ${formatDate(schedule!.from)} (en cours)`}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
