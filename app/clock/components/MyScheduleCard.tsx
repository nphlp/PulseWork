import { DayOfWeek, Work } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Calendar } from "lucide-react";

type MyScheduleCardProps = {
    schedule: Work[] | null;
};

const dayNames: Record<DayOfWeek, string> = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
    SUNDAY: "Dimanche",
};

const dayOrder: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export function MyScheduleCard({ schedule }: MyScheduleCardProps) {
    if (!schedule || schedule.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Mes horaires
                    </CardTitle>
                    <CardDescription>Votre planning hebdomadaire</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground py-4 text-center">Aucun horaire configuré</p>
                </CardContent>
            </Card>
        );
    }

    // Trier les jours dans l'ordre
    const sortedSchedule = [...schedule].sort((a, b) => {
        return dayOrder.indexOf(a.arrivingDay) - dayOrder.indexOf(b.arrivingDay);
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Mes horaires
                </CardTitle>
                <CardDescription>Votre planning hebdomadaire</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {sortedSchedule.map((work, index) => (
                        <div
                            key={`${work.arrivingDay}-${index}`}
                            className="flex items-center justify-between rounded-lg border p-3"
                        >
                            <div className="flex-1">
                                <p className="font-medium">{dayNames[work.arrivingDay]}</p>
                                <p className="text-muted-foreground text-sm">
                                    {work.arriving} - {work.leaving}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
