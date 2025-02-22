/*
  Warnings:

  - You are about to drop the column `latitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Location` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_parentId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "parentId",
ADD COLUMN     "adminLevel1" TEXT,
ADD COLUMN     "adminLevel2" TEXT,
ADD COLUMN     "adminLevel3" TEXT,
ADD COLUMN     "country" TEXT;
