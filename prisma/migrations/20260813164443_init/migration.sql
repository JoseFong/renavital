/*
  Warnings:

  - Made the column `active` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_anesthesiaId_fkey";

-- DropForeignKey
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_procedureId_fkey";

-- DropForeignKey
ALTER TABLE "Configuration" DROP CONSTRAINT "Configuration_stayId_fkey";

-- DropForeignKey
ALTER TABLE "ConfigurationCategories" DROP CONSTRAINT "ConfigurationCategories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ConfigurationCategories" DROP CONSTRAINT "ConfigurationCategories_configurationId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "active" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "active" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_anesthesiaId_fkey" FOREIGN KEY ("anesthesiaId") REFERENCES "Anesthesia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_stayId_fkey" FOREIGN KEY ("stayId") REFERENCES "Stay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurationCategories" ADD CONSTRAINT "ConfigurationCategories_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurationCategories" ADD CONSTRAINT "ConfigurationCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
