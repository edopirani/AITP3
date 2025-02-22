/*
  Warnings:

  - You are about to drop the column `googleType` on the `LocationCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LocationCategory_googleType_key";

-- AlterTable
ALTER TABLE "LocationCategory" DROP COLUMN "googleType";

-- CreateTable
CREATE TABLE "LocationCategoryMapping" (
    "id" UUID NOT NULL,
    "googleType" TEXT NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "LocationCategoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationCategoryMapping_googleType_key" ON "LocationCategoryMapping"("googleType");

-- AddForeignKey
ALTER TABLE "LocationCategoryMapping" ADD CONSTRAINT "LocationCategoryMapping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LocationCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
