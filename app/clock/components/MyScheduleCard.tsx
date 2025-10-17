import { Day, DayOfWeek } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { Calendar } from "lucide-react";

type MyScheduleCardProps = {
    schedule: Day[] | null;
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

function formatBreak(minutes: number | null): string {
    if (!minutes) return "Aucune pause";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h${mins}`;
    if (hours > 0) return `${hours}h`;
    return `${mins}min`;
}

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
        return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
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
                    {sortedSchedule.map((day) => (
                        <div key={day.dayOfWeek} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex-1">
                                <p className="font-medium">{dayNames[day.dayOfWeek]}</p>
                                <p className="text-muted-foreground text-sm">
                                    {day.arriving} - {day.leaving}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-muted-foreground text-sm">Pause</p>
                                <p className="text-sm font-medium">{formatBreak(day.breack)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
