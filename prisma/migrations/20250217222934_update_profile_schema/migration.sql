/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `ageRange` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `profileType` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipStatus` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `ProfileLanguage` table. All the data in the column will be lost.
  - You are about to drop the `InterestCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfilePreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfilePreferenceOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfilePreferenceType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[profileId,languageId]` on the table `ProfileLanguage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `languageId` to the `ProfileLanguage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilePreference" DROP CONSTRAINT "ProfilePreference_preferenceOptionId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilePreference" DROP CONSTRAINT "ProfilePreference_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilePreferenceOption" DROP CONSTRAINT "ProfilePreferenceOption_typeId_fkey";

-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "categoryId",
ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "ageRange",
DROP COLUMN "gender",
DROP COLUMN "profileType",
DROP COLUMN "relationshipStatus",
ADD COLUMN     "ageRangeId" UUID,
ADD COLUMN     "comfortPreferenceId" UUID,
ADD COLUMN     "fitnessPreferenceId" UUID,
ADD COLUMN     "genderId" UUID,
ADD COLUMN     "nightlifePreferenceId" UUID,
ADD COLUMN     "pacePreferenceId" UUID,
ADD COLUMN     "profileTypeId" UUID,
ADD COLUMN     "relationshipStatusId" UUID,
ADD COLUMN     "schedulePreferenceId" UUID,
ADD COLUMN     "soloTravelerPreferenceId" UUID;

-- AlterTable
ALTER TABLE "ProfileLanguage" DROP COLUMN "language",
ADD COLUMN     "languageId" UUID NOT NULL;

-- DropTable
DROP TABLE "InterestCategory";

-- DropTable
DROP TABLE "ProfilePreference";

-- DropTable
DROP TABLE "ProfilePreferenceOption";

-- DropTable
DROP TABLE "ProfilePreferenceType";

-- CreateTable
CREATE TABLE "ProfileType" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProfileType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgeRange" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AgeRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gender" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipStatus" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RelationshipStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FitnessOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "FitnessOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaceOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "PaceOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoloTravelerOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "SoloTravelerOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "ScheduleOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComfortOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "ComfortOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NightlifeOption" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "NightlifeOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileType_name_key" ON "ProfileType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AgeRange_name_key" ON "AgeRange"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Gender_name_key" ON "Gender"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipStatus_name_key" ON "RelationshipStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FitnessOption_name_key" ON "FitnessOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FitnessOption_value_key" ON "FitnessOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "PaceOption_name_key" ON "PaceOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaceOption_value_key" ON "PaceOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "SoloTravelerOption_name_key" ON "SoloTravelerOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SoloTravelerOption_value_key" ON "SoloTravelerOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleOption_name_key" ON "ScheduleOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleOption_value_key" ON "ScheduleOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ComfortOption_name_key" ON "ComfortOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ComfortOption_value_key" ON "ComfortOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "NightlifeOption_name_key" ON "NightlifeOption"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NightlifeOption_value_key" ON "NightlifeOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileLanguage_profileId_languageId_key" ON "ProfileLanguage"("profileId", "languageId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_profileTypeId_fkey" FOREIGN KEY ("profileTypeId") REFERENCES "ProfileType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_ageRangeId_fkey" FOREIGN KEY ("ageRangeId") REFERENCES "AgeRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_relationshipStatusId_fkey" FOREIGN KEY ("relationshipStatusId") REFERENCES "RelationshipStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_fitnessPreferenceId_fkey" FOREIGN KEY ("fitnessPreferenceId") REFERENCES "FitnessOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pacePreferenceId_fkey" FOREIGN KEY ("pacePreferenceId") REFERENCES "PaceOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_soloTravelerPreferenceId_fkey" FOREIGN KEY ("soloTravelerPreferenceId") REFERENCES "SoloTravelerOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_schedulePreferenceId_fkey" FOREIGN KEY ("schedulePreferenceId") REFERENCES "ScheduleOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_comfortPreferenceId_fkey" FOREIGN KEY ("comfortPreferenceId") REFERENCES "ComfortOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_nightlifePreferenceId_fkey" FOREIGN KEY ("nightlifePreferenceId") REFERENCES "NightlifeOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileLanguage" ADD CONSTRAINT "ProfileLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
