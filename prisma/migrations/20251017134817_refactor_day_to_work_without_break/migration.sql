/*
  Warnings:

  - You are about to drop the `Day` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Day" DROP CONSTRAINT "Day_scheduleId_fkey";

-- DropTable
DROP TABLE "public"."Day";

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "arrivingDay" "DayOfWeek" NOT NULL,
    "leavingDay" "DayOfWeek" NOT NULL,
    "arriving" TEXT NOT NULL,
    "leaving" TEXT NOT NULL,
    "pointingArrival" BOOLEAN NOT NULL,
    "pointingDeparture" BOOLEAN NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Work_scheduleId_idx" ON "Work"("scheduleId");

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
