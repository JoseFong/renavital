/*
  Warnings:

  - You are about to drop the column `folio` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `basefolio` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revision` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Quote_folio_key";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "folio",
ADD COLUMN     "basefolio" TEXT NOT NULL,
ADD COLUMN     "revision" INTEGER NOT NULL;
