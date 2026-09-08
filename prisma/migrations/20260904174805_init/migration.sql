/*
  Warnings:

  - You are about to drop the column `productTypeId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productTypeId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "productTypeId";

-- DropTable
DROP TABLE "ProductType";

-- CreateTable
CREATE TABLE "ProductClassification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "ProductClassification_pkey" PRIMARY KEY ("id")
);
