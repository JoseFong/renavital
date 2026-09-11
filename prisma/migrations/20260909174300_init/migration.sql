/*
  Warnings:

  - Made the column `firstName` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "firstName" SET NOT NULL;
