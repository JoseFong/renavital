/*
  Warnings:

  - Made the column `shortForm` on table `Anesthesia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shortForm` on table `Procedure` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shortForm` on table `Stay` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Anesthesia" ALTER COLUMN "shortForm" SET NOT NULL;

-- AlterTable
ALTER TABLE "Procedure" ALTER COLUMN "shortForm" SET NOT NULL;

-- AlterTable
ALTER TABLE "Stay" ALTER COLUMN "shortForm" SET NOT NULL;
