/*
  Warnings:

  - A unique constraint covering the columns `[googlePlaceId]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Made the column `googlePlaceId` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "googlePlaceId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Location_googlePlaceId_key" ON "Location"("googlePlaceId");
