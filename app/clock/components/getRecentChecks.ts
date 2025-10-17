import { Clock } from "@prisma/client";
import { RecentCheck } from "./getClockData";

type GetRecentChecksParams = {
    lastEmployeeClocks: Clock[];
};

export async function getRecentChecks(props: GetRecentChecksParams): Promise<RecentCheck[]> {
    const { lastEmployeeClocks } = props;

    return lastEmployeeClocks.slice(0, 5).map((c) => ({
        id: c.id,
        date: c.date,
        type: c.checkType,
        createdAt: c.createdAt,
    }));
}
