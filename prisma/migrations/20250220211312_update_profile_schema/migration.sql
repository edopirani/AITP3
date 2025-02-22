/*
  Warnings:

  - You are about to drop the column `activity` on the `ItineraryItem` table. All the data in the column will be lost.
  - You are about to drop the column `purposeId` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `dayNumber` to the `ItineraryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `ItineraryItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `locationId` on table `ItineraryItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ItineraryItem" DROP CONSTRAINT "ItineraryItem_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_purposeId_fkey";

-- AlterTable
ALTER TABLE "ItineraryItem" DROP COLUMN "activity",
ADD COLUMN     "dayNumber" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "locationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "tourismPreferenceId" UUID;

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "purposeId",
ADD COLUMN     "customPurpose" TEXT;

-- CreateTable
CREATE TABLE "TourismOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "TourismOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripPurposeRelation" (
    "tripId" UUID NOT NULL,
    "purposeId" UUID NOT NULL,

    CONSTRAINT "TripPurposeRelation_pkey" PRIMARY KEY ("tripId","purposeId")
);

-- CreateTable
CREATE TABLE "ItineraryActivity" (
    "id" UUID NOT NULL,
    "itineraryItemId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "isBreak" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ItineraryActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourismOption_name_key" ON "TourismOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TourismOption_value_key" ON "TourismOption"("value");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_tourismPreferenceId_fkey" FOREIGN KEY ("tourismPreferenceId") REFERENCES "TourismOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPurposeRelation" ADD CONSTRAINT "TripPurposeRelation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPurposeRelation" ADD CONSTRAINT "TripPurposeRelation_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "TripPurpose"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryActivity" ADD CONSTRAINT "ItineraryActivity_itineraryItemId_fkey" FOREIGN KEY ("itineraryItemId") REFERENCES "ItineraryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
