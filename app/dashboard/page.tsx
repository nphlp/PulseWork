import { ChartAreaStacked } from "@comps/SHADCN/components/chart-area-stacked";

export default function Page() {
    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ];

    const chartData2 = [
        { month: "January", desktop: 136, mobile: 170 },
        { month: "February", desktop: 85, mobile: 220 },
        { month: "March", desktop: 127, mobile: 220 },
        { month: "April", desktop: 400, mobile: 100 },
        { month: "May", desktop: 45, mobile: 210 },
        { month: "June", desktop: 94, mobile: 300 },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            <ChartAreaStacked chartData={chartData} />
            <ChartAreaStacked chartData={chartData2} />
        </div>
    );
}
