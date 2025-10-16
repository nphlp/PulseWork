"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@shadcn/ui/chart";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
    workTime: {
        label: "Heures travaillées",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

type ChartAreaWorkTimeProps = {
    chartData: {
        week: string;
        workTime: number;
    }[];
};

export function ChartAreaWorkTime(props: ChartAreaWorkTimeProps) {
    const { chartData } = props;

    // Calculate average work time
    const avgWorkTime = (chartData.reduce((sum, item) => sum + item.workTime, 0) / chartData.length).toFixed(1);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Temps travaillé moyen</CardTitle>
                <CardDescription>Heures travaillées par semaine (3 derniers mois)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
                    <AreaChart
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
                            tickFormatter={(value) => `${value}h`}
                            domain={[32, 42]}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area
                            dataKey="workTime"
                            type="natural"
                            fill="var(--color-workTime)"
                            fillOpacity={0.4}
                            stroke="var(--color-workTime)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Moyenne: {avgWorkTime}h par semaine <TrendingUp className="h-4 w-4" />
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
