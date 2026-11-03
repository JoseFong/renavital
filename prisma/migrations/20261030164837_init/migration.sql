/*
  Warnings:

  - Made the column `canQuote` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "canQuote" SET NOT NULL,
ALTER COLUMN "code" SET NOT NULL;
