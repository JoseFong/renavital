/*
  Warnings:

  - Made the column `active` on table `Anesthesia` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `active` to the `Procedure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anesthesia" ALTER COLUMN "active" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "active" BOOLEAN;

-- AlterTable
ALTER TABLE "Procedure" ADD COLUMN     "active" BOOLEAN NOT NULL;
