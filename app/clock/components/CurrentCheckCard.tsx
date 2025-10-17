"use client";

import { CheckStatus, CurrentDayCheck } from "@app/clock/components/getClockData";
import { Button } from "@shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/ui/card";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateClock } from "@/actions/ClockAction";

type CheckLineProps = {
    label: string;
    time: string;
    status: CheckStatus;
    onCheck: () => Promise<void>;
    loading: boolean;
};

function CheckLine({ label, time, status, onCheck, loading }: CheckLineProps) {
    const getStatusInfo = () => {
        switch (status) {
            case "checked":
                return {
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    text: "Pointé",
                    color: "text-green-600",
                    showButton: false,
                };
            case "to_check":
                return {
                    icon: <Clock className="h-5 w-5 text-blue-600" />,
                    text: `Prochain pointage à ${time}`,
                    color: "text-blue-600",
                    showButton: false,
                };
            case "late":
                return {
                    icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
                    text: `Pointage de ${time} à faire`,
                    color: "text-orange-600",
                    showButton: true,
                };
            case "missed":
                return {
                    icon: <XCircle className="h-5 w-5 text-red-600" />,
                    text: "Pointage manqué",
                    color: "text-red-600",
                    showButton: false,
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
                {statusInfo.icon}
                <div>
                    <p className="font-medium">{label}</p>
                    <p className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</p>
                </div>
            </div>
            {statusInfo.showButton && (
                <Button onClick={onCheck} disabled={loading} size="sm">
                    {loading ? "En cours..." : "Pointer"}
                </Button>
            )}
        </div>
    );
}

type CurrentCheckCardProps = {
    currentDay: CurrentDayCheck | null;
};

export function CurrentCheckCard({ currentDay }: CurrentCheckCardProps) {
    const [loadingCheckin, setLoadingCheckin] = useState(false);
    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const router = useRouter();

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

    const handleCheckin = async () => {
        setLoadingCheckin(true);
        try {
            await CreateClock({
                checkType: "CHECKIN",
                date: new Date(),
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to check in:", error);
        } finally {
            setLoadingCheckin(false);
        }
    };

    const handleCheckout = async () => {
        setLoadingCheckout(true);
        try {
            await CreateClock({
                checkType: "CHECKOUT",
                date: new Date(),
            });
            router.refresh();
        } catch (error) {
            console.error("Failed to check out:", error);
        } finally {
            setLoadingCheckout(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pointage du jour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CheckLine
                    label="Arrivée"
                    time={currentDay.arriving}
                    status={currentDay.checkin.status}
                    onCheck={handleCheckin}
                    loading={loadingCheckin}
                />
                <CheckLine
                    label="Départ"
                    time={currentDay.leaving}
                    status={currentDay.checkout.status}
                    onCheck={handleCheckout}
                    loading={loadingCheckout}
                />
            </CardContent>
        </Card>
    );
}
