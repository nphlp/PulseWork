"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@shadcn/ui/chart";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
    expected: {
        label: "Temps prévu",
        color: "var(--chart-3)",
    },
    actual: {
        label: "Temps effectué",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

type ChartBarAttendanceProps = {
    chartData: {
        week: string;
        expected: number;
        actual: number;
    }[];
};

export function ChartBarAttendance(props: ChartBarAttendanceProps) {
    const { chartData } = props;

    // Calculate average attendance rate
    const totalExpected = chartData.reduce((sum, item) => sum + item.expected, 0);
    const totalActual = chartData.reduce((sum, item) => sum + item.actual, 0);
    const avgAttendanceRate = ((totalActual / totalExpected) * 100).toFixed(1);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Assiduité</CardTitle>
                <CardDescription>Temps prévu vs temps effectué par semaine (3 derniers mois)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
                    <BarChart
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
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="expected" fill="var(--color-expected)" radius={4} />
                        <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Taux d&apos;assiduité moyen: {avgAttendanceRate}% <TrendingUp className="h-4 w-4" />
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
