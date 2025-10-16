import { ChartAreaWorkTime } from "./components/chart-area-work-time";
import { ChartBarAttendance } from "./components/chart-bar-attendance";
import { ChartLineDelay } from "./components/chart-line-delay";

export default function Page() {
    // Données fictives - Taux de retard par semaine (en pourcentage)
    const delayData = [
        { week: "1", delayRate: 15 },
        { week: "2", delayRate: 18 },
        { week: "3", delayRate: 12 },
        { week: "4", delayRate: 20 },
        { week: "5", delayRate: 14 },
        { week: "6", delayRate: 16 },
        { week: "7", delayRate: 11 },
        { week: "8", delayRate: 13 },
        { week: "9", delayRate: 17 },
        { week: "10", delayRate: 15 },
        { week: "11", delayRate: 19 },
        { week: "12", delayRate: 14 },
    ];

    // Données fictives - Heures travaillées par semaine
    const workTimeData = [
        { week: "1", workTime: 38.5 },
        { week: "2", workTime: 40.0 },
        { week: "3", workTime: 39.2 },
        { week: "4", workTime: 37.8 },
        { week: "5", workTime: 41.5 },
        { week: "6", workTime: 39.8 },
        { week: "7", workTime: 40.5 },
        { week: "8", workTime: 38.9 },
        { week: "9", workTime: 39.5 },
        { week: "10", workTime: 40.2 },
        { week: "11", workTime: 38.7 },
        { week: "12", workTime: 39.9 },
    ];

    // Données fictives - Assiduité (temps prévu vs temps effectué)
    const attendanceData = [
        { week: "1", expected: 40, actual: 38.5 },
        { week: "2", expected: 40, actual: 40.0 },
        { week: "3", expected: 40, actual: 39.2 },
        { week: "4", expected: 40, actual: 37.8 },
        { week: "5", expected: 40, actual: 41.5 },
        { week: "6", expected: 40, actual: 39.8 },
        { week: "7", expected: 40, actual: 40.5 },
        { week: "8", expected: 40, actual: 38.9 },
        { week: "9", expected: 40, actual: 39.5 },
        { week: "10", expected: 40, actual: 40.2 },
        { week: "11", expected: 40, actual: 38.7 },
        { week: "12", expected: 40, actual: 39.9 },
    ];

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">KPIs</h1>
                <p className="text-muted-foreground mt-2">Indicateurs de performance des employés</p>
            </div>

            <div className="space-y-6">
                <ChartLineDelay chartData={delayData} />
                <ChartAreaWorkTime chartData={workTimeData} />
                <ChartBarAttendance chartData={attendanceData} />
            </div>
        </div>
    );
}
