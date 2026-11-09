/*
  Warnings:

  - The `taxRate` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "taxRate",
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
