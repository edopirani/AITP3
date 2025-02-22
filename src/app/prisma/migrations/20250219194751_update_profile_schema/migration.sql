/*
  Warnings:

  - You are about to drop the column `popularityCounter` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `LocationCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleType]` on the table `LocationCategory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleType` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `googleType` to the `LocationCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "popularityCounter",
ADD COLUMN     "googleType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LocationCategory" ADD COLUMN     "googleType" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LocationCategory_name_key" ON "LocationCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LocationCategory_googleType_key" ON "LocationCategory"("googleType");
