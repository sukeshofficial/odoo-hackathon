-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "currency" TEXT DEFAULT 'USD',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "Stop" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "cityName" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "stopId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDatetime" TIMESTAMP(3) NOT NULL,
    "durationHours" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "type" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
