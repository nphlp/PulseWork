"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@shadcn/ui/chart";
import { TrendingDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
    delayRate: {
        label: "Taux de retard",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig;

type ChartLineDelayProps = {
    chartData: {
        week: string;
        delayRate: number;
    }[];
};

export function ChartLineDelay(props: ChartLineDelayProps) {
    const { chartData } = props;

    // Calculate average delay rate
    const avgDelayRate = (chartData.reduce((sum, item) => sum + item.delayRate, 0) / chartData.length).toFixed(1);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Taux de retard moyen</CardTitle>
                <CardDescription>Pourcentage d&apos;employés en retard par semaine (3 derniers mois)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `S${value}`}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line
                            dataKey="delayRate"
                            type="monotone"
                            stroke="var(--color-delayRate)"
                            strokeWidth={3}
                            dot={{
                                fill: "var(--color-delayRate)",
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                            connectNulls
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Moyenne: {avgDelayRate}% <TrendingDown className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            12 dernières semaines
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
