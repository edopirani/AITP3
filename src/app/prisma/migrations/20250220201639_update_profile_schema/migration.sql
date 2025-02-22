/*
  Warnings:

  - You are about to drop the column `name` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `basePreferenceId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budgetId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purposeId` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "name",
ADD COLUMN     "basePreferenceId" UUID NOT NULL,
ADD COLUMN     "budgetId" UUID NOT NULL,
ADD COLUMN     "flexibleDates" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "purposeId" UUID NOT NULL,
ADD COLUMN     "typeId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "TripPurpose" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TripPurpose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TripType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetOption" (
    "id" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "BudgetOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BasePreferenceOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BasePreferenceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripProfile" (
    "tripId" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "partySize" INTEGER,

    CONSTRAINT "TripProfile_pkey" PRIMARY KEY ("tripId","profileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripPurpose_name_key" ON "TripPurpose"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TripType_name_key" ON "TripType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetOption_value_key" ON "BudgetOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "BasePreferenceOption_name_key" ON "BasePreferenceOption"("name");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "TripPurpose"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TripType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_basePreferenceId_fkey" FOREIGN KEY ("basePreferenceId") REFERENCES "BasePreferenceOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripProfile" ADD CONSTRAINT "TripProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripProfile" ADD CONSTRAINT "TripProfile_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
