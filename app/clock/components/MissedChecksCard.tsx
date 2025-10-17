import { MissedCheck } from "@app/clock/components/getClockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { AlertTriangle } from "lucide-react";

type MissedChecksCardProps = {
    missedChecks: MissedCheck[];
};

export function MissedChecksCard({ missedChecks }: MissedChecksCardProps) {
    if (missedChecks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pointages manqués</CardTitle>
                    <CardDescription>Les pointages manqués depuis plus d&apos;1h</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground py-4 text-center">Aucun pointage manqué</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Pointages manqués
                </CardTitle>
                <CardDescription>Les pointages manqués depuis plus d&apos;1h</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {missedChecks.map((check, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <p className="font-medium">
                                    {check.type === "CHECKIN" ? "Arrivée" : "Départ"} - {check.time}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {new Date(check.date).toLocaleDateString("fr-FR", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                    })}
                                </p>
                            </div>
                            <span className="text-sm text-red-600">{check.missedSince}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
