import { AccountRoutes } from "@services/api/AccountApi";
import { ClockRoutes } from "@services/api/ClockApi";
import { ContractRoutes } from "@services/api/ContractApi";
import { LeaveRoutes } from "@services/api/LeaveApi";
import { ScheduleRoutes } from "@services/api/ScheduleApi";
import { SessionRoutes } from "@services/api/SessionApi";
import { TaskRoutes } from "@services/api/TaskApi";
import { TeamRoutes } from "@services/api/TeamApi";
import { TeamMemberRoutes } from "@services/api/TeamMemberApi";
import { UserRoutes } from "@services/api/UserApi";
import { VerificationRoutes } from "@services/api/VerificationApi";
import { WorkRoutes } from "@services/api/WorkApi";

export type Routes<Input> = AccountRoutes<Input> &
    ClockRoutes<Input> &
    ContractRoutes<Input> &
    LeaveRoutes<Input> &
    ScheduleRoutes<Input> &
    SessionRoutes<Input> &
    TaskRoutes<Input> &
    TeamRoutes<Input> &
    TeamMemberRoutes<Input> &
    UserRoutes<Input> &
    VerificationRoutes<Input> &
    WorkRoutes<Input>;
