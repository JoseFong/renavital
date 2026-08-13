/*
  Warnings:

  - Added the required column `active` to the `Configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active` to the `ConfigurationCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active` to the `Stay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anesthesia" ADD COLUMN     "active" BOOLEAN;

-- AlterTable
ALTER TABLE "Configuration" ADD COLUMN     "active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ConfigurationCategories" ADD COLUMN     "active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "active" BOOLEAN;

-- AlterTable
ALTER TABLE "Stay" ADD COLUMN     "active" BOOLEAN NOT NULL;
