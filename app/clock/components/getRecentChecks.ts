import { RecentCheck } from "./getClockData";

type Clock = {
    id: string;
    date: Date;
    checkType: "CHECKIN" | "CHECKOUT";
    employeeId: string;
    createdAt: Date;
    updatedAt: Date;
};

type GetRecentChecksParams = {
    allClocks: Clock[];
};

/**
 * Récupère les 10 derniers pointages effectués
 */
export async function getRecentChecks({ allClocks }: GetRecentChecksParams): Promise<RecentCheck[]> {
    return allClocks.slice(0, 10).map((c) => ({
        id: c.id,
        date: c.date,
        type: c.checkType,
        createdAt: c.createdAt,
    }));
}
