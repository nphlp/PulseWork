import { cn } from "@shadcn/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

type KPICardProps = {
    title: string;
    value: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
};

export function KPICard({ title, value, trend, icon }: KPICardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <p
                        className={cn(
                            "mt-1 flex items-center gap-1 text-xs",
                            trend.isPositive ? "text-green-600" : "text-red-600",
                        )}
                    >
                        {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>
                            {trend.value > 0 ? "+" : ""}
                            {trend.value.toFixed(1)}% vs semaine dernière
                        </span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
