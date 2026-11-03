/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercentage` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `extraDiscount` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `totalMxn` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `totalUsd` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `discountAppliesTo` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountValue` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraDiscountAppliesTo` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraDiscountType` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraDiscountValue` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotalMxn` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTotalUsd` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "discountAmount",
DROP COLUMN "discountPercentage",
DROP COLUMN "extraDiscount",
DROP COLUMN "totalMxn",
DROP COLUMN "totalUsd",
ADD COLUMN     "discountAppliesTo" TEXT NOT NULL,
ADD COLUMN     "discountType" TEXT NOT NULL,
ADD COLUMN     "discountValue" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "extraDiscountAppliesTo" TEXT NOT NULL,
ADD COLUMN     "extraDiscountType" TEXT NOT NULL,
ADD COLUMN     "extraDiscountValue" TEXT NOT NULL,
ADD COLUMN     "subTotalMxn" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "subTotalUsd" DECIMAL(65,30) NOT NULL;
