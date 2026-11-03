-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "discountAppliesTo" DROP NOT NULL,
ALTER COLUMN "discountType" DROP NOT NULL,
ALTER COLUMN "discountValue" DROP NOT NULL,
ALTER COLUMN "extraDiscountAppliesTo" DROP NOT NULL,
ALTER COLUMN "extraDiscountType" DROP NOT NULL,
ALTER COLUMN "extraDiscountValue" DROP NOT NULL;
