/*
  Warnings:

  - You are about to drop the column `category` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `comfortOrAdventure` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fitnessLevel` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `nightlifeInterest` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredPace` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `schedulePreference` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `soloTraveler` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ProfileMovingPreference` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ProfileStayingPreference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Interest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,movingPrefId]` on the table `ProfileMovingPreference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,stayingPrefId]` on the table `ProfileStayingPreference` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Interest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movingPrefId` to the `ProfileMovingPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stayingPrefId` to the `ProfileStayingPreference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "category",
DROP COLUMN "profileId",
ADD COLUMN     "categoryId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "comfortOrAdventure",
DROP COLUMN "fitnessLevel",
DROP COLUMN "nightlifeInterest",
DROP COLUMN "preferredPace",
DROP COLUMN "schedulePreference",
DROP COLUMN "soloTraveler";

-- AlterTable
ALTER TABLE "ProfileMovingPreference" DROP COLUMN "type",
ADD COLUMN     "movingPrefId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ProfileStayingPreference" DROP COLUMN "type",
ADD COLUMN     "stayingPrefId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "MovingPreference" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "MovingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StayingPreference" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "StayingPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterestCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InterestCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileInterest" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "interestId" UUID NOT NULL,

    CONSTRAINT "ProfileInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePreferenceType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProfilePreferenceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePreferenceOption" (
    "id" UUID NOT NULL,
    "typeId" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "ProfilePreferenceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePreference" (
    "id" UUID NOT NULL,
    "profileId" UUID NOT NULL,
    "preferenceOptionId" UUID NOT NULL,

    CONSTRAINT "ProfilePreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovingPreference_type_key" ON "MovingPreference"("type");

-- CreateIndex
CREATE UNIQUE INDEX "StayingPreference_type_key" ON "StayingPreference"("type");

-- CreateIndex
CREATE UNIQUE INDEX "InterestCategory_name_key" ON "InterestCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileInterest_profileId_interestId_key" ON "ProfileInterest"("profileId", "interestId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePreferenceType_name_key" ON "ProfilePreferenceType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePreference_profileId_preferenceOptionId_key" ON "ProfilePreference"("profileId", "preferenceOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "Interest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileMovingPreference_profileId_movingPrefId_key" ON "ProfileMovingPreference"("profileId", "movingPrefId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileStayingPreference_profileId_stayingPrefId_key" ON "ProfileStayingPreference"("profileId", "stayingPrefId");

-- AddForeignKey
ALTER TABLE "ProfileMovingPreference" ADD CONSTRAINT "ProfileMovingPreference_movingPrefId_fkey" FOREIGN KEY ("movingPrefId") REFERENCES "MovingPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileStayingPreference" ADD CONSTRAINT "ProfileStayingPreference_stayingPrefId_fkey" FOREIGN KEY ("stayingPrefId") REFERENCES "StayingPreference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interest" ADD CONSTRAINT "Interest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InterestCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileInterest" ADD CONSTRAINT "ProfileInterest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileInterest" ADD CONSTRAINT "ProfileInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePreferenceOption" ADD CONSTRAINT "ProfilePreferenceOption_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ProfilePreferenceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePreference" ADD CONSTRAINT "ProfilePreference_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePreference" ADD CONSTRAINT "ProfilePreference_preferenceOptionId_fkey" FOREIGN KEY ("preferenceOptionId") REFERENCES "ProfilePreferenceOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
