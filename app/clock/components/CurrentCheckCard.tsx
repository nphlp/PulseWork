"use client";

import { CheckStatus, CurrentDayCheck } from "@app/clock/components/getClockData";
import { CheckType } from "@prisma/client";
import { Button } from "@shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn/ui/card";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateClock } from "@/actions/ClockAction";

type CheckLineProps = {
    label: string;
    expectedTime: string; // Format "HH:MM"
    clockedAt?: Date; // Heure réelle de pointage
    status: CheckStatus;
    checkType: CheckType;
    onCheck: (type: CheckType) => Promise<void>;
    loading: boolean;
};

function CheckLine({ label, expectedTime, clockedAt, status, checkType, onCheck, loading }: CheckLineProps) {
    const getStatusInfo = () => {
        switch (status) {
            case "checked":
                const clockedAtTime = clockedAt
                    ? new Date(clockedAt).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "";
                return {
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    text: clockedAtTime ? `Pointé à ${clockedAtTime}` : "Pointé",
                    color: "text-green-600",
                    buttonDisabled: true,
                    buttonText: "Déjà pointé",
                };
            case "too_early":
                return {
                    icon: <Clock className="h-5 w-5 text-blue-600" />,
                    text: "Bientôt disponible",
                    color: "text-blue-600",
                    buttonDisabled: true,
                    buttonText: "Bientôt disponible",
                };
            case "on_time":
                return {
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    text: "Plage de pointage",
                    color: "text-green-600",
                    buttonDisabled: false,
                    buttonText: "Pointer maintenant",
                };
            case "late":
                return {
                    icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
                    text: "En retard",
                    color: "text-orange-600",
                    buttonDisabled: false,
                    buttonText: "Pointer maintenant",
                };
            case "missed":
                return {
                    icon: <XCircle className="h-5 w-5 text-red-600" />,
                    text: "Pointage manqué",
                    color: "text-red-600",
                    buttonDisabled: true,
                    buttonText: "Pointage manqué",
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="flex items-center justify-between rounded-lg border px-5 py-3">
            <div className="flex items-center gap-3">
                {statusInfo.icon}
                <div>
                    <p className="font-medium">
                        {label} {expectedTime}
                    </p>
                    <p className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</p>
                </div>
            </div>
            <Button onClick={() => onCheck(checkType)} disabled={loading || statusInfo.buttonDisabled}>
                {loading ? "En cours..." : statusInfo.buttonText}
            </Button>
        </div>
    );
}

type CurrentCheckCardProps = {
    currentDay: CurrentDayCheck | null;
};

export function CurrentCheckCard(props: CurrentCheckCardProps) {
    const { currentDay } = props;

    const [loadingType, setLoadingType] = useState<CheckType | null>(null);
    const router = useRouter();

    const handleCheck = async (checkType: CheckType) => {
        setLoadingType(checkType);
        try {
            await CreateClock({
                checkType,
                date: new Date(),
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to check:", error);
        } finally {
            setLoadingType(null);
        }
    };

    if (!currentDay) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Pointage du jour</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Aucun horaire de travail configuré pour aujourd&apos;hui.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pointage du jour</CardTitle>
                <CardDescription>
                    Connectez vous dans les 15 minutes avant et après votre horaire de travail pour pointer.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-6">
                <CheckLine
                    label="Arrivée"
                    expectedTime={currentDay.checkin.time}
                    clockedAt={currentDay.checkin.clockedAt}
                    status={currentDay.checkin.status}
                    checkType="CHECKIN"
                    onCheck={handleCheck}
                    loading={loadingType === "CHECKIN"}
                />
                <CheckLine
                    label="Départ"
                    expectedTime={currentDay.checkout.time}
                    clockedAt={currentDay.checkout.clockedAt}
                    status={currentDay.checkout.status}
                    checkType="CHECKOUT"
                    onCheck={handleCheck}
                    loading={loadingType === "CHECKOUT"}
                />
            </CardContent>
        </Card>
    );
}
