"use server";

import { getSession } from "@lib/authServer";
import { CheckType } from "@prisma/client";
import { ClockCreateAction } from "@services/actions/ClockAction";
import { ClockModel } from "@services/types";
import { cacheLifeApi } from "@utils/FetchConfig";
import { revalidateTag } from "next/cache";
import { unauthorized } from "next/navigation";
import z, { ZodType } from "zod";

type CreateClockProps = {
    checkType: CheckType;
    date: Date;
};

const createClockSchema: ZodType<CreateClockProps> = z.object({
    checkType: z.enum(["CHECKIN", "CHECKOUT"]),
    date: z.date(),
});

export const CreateClock = async (props: CreateClockProps): Promise<ClockModel | null> => {
    try {
        const { checkType, date } = createClockSchema.parse(props);

        // Check session
        const session = await getSession();
        if (!session) unauthorized();

        // Proceed to creation
        const createdClock = await ClockCreateAction({
            data: {
                checkType,
                date,
                employeeId: session.user.id,
            },
        });

        // Reset specific cache tags
        revalidateTag("clock-findMany", cacheLifeApi);

        console.log("Clock creation succeeded", createdClock.checkType, createdClock.date);

        return createdClock;
    } catch (error) {
        console.error("Failed to create clock:", error);
        return null;
    }
};
