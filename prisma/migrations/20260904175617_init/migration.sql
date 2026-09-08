-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productClassificationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productClassificationId_fkey" FOREIGN KEY ("productClassificationId") REFERENCES "ProductClassification"("id") ON DELETE SET NULL ON UPDATE CASCADE;
