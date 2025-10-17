import { Clock } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { CheckCircle2, LogOut } from "lucide-react";

type RecentChecksCardProps = {
    recentChecks: Clock[];
};

export function RecentChecksCard({ recentChecks }: RecentChecksCardProps) {
    if (recentChecks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pointages récents</CardTitle>
                    <CardDescription>Les 10 derniers pointages effectués</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground py-4 text-center">Aucun pointage effectué</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pointages récents</CardTitle>
                <CardDescription>Les 10 derniers pointages effectués</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {recentChecks.map((check) => (
                        <div key={check.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                                {check.checkType === "CHECKIN" ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : (
                                    <LogOut className="h-5 w-5 text-blue-600" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        {check.checkType === "CHECKIN" ? "Arrivée" : "Départ"}
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        {new Date(check.date).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                        })}
                                    </p>
                                </div>
                            </div>
                            <span className="text-muted-foreground text-sm">
                                {new Date(check.date).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
