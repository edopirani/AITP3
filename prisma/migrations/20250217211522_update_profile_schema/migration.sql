/*
  Warnings:

  - Made the column `fitnessLevel` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preferredPace` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `soloTraveler` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `schedulePreference` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `comfortOrAdventure` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nightlifeInterest` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "fitnessLevel" SET NOT NULL,
ALTER COLUMN "fitnessLevel" SET DEFAULT 2,
ALTER COLUMN "preferredPace" SET NOT NULL,
ALTER COLUMN "preferredPace" SET DEFAULT 2,
ALTER COLUMN "soloTraveler" SET NOT NULL,
ALTER COLUMN "soloTraveler" SET DEFAULT 2,
ALTER COLUMN "schedulePreference" SET NOT NULL,
ALTER COLUMN "schedulePreference" SET DEFAULT 2,
ALTER COLUMN "comfortOrAdventure" SET NOT NULL,
ALTER COLUMN "comfortOrAdventure" SET DEFAULT 2,
ALTER COLUMN "nightlifeInterest" SET NOT NULL,
ALTER COLUMN "nightlifeInterest" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "ProfileLanguage" ALTER COLUMN "proficiency" SET DEFAULT 2;
