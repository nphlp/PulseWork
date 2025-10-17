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

    // Grouper les Work periods par jour
    const worksByDay = schedule.reduce(
        (acc, work) => {
            if (!acc[work.arrivingDay]) {
                acc[work.arrivingDay] = [];
            }
            acc[work.arrivingDay].push(work);
            return acc;
        },
        {} as Record<DayOfWeek, Work[]>,
    );

    // Trier les jours dans l'ordre et trier les périodes de chaque jour par heure
    const sortedDays = dayOrder
        .filter((day) => worksByDay[day])
        .map((day) => ({
            day,
            works: worksByDay[day].sort((a, b) => a.arriving.localeCompare(b.arriving)),
        }));

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
                    {sortedDays.map(({ day, works }) => (
                        <div key={day} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex-1">
                                <p className="font-medium">{dayNames[day]}</p>
                                <p className="text-muted-foreground text-sm">
                                    {works.map((work) => `${work.arriving} -> ${work.leaving}`).join(", ")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
