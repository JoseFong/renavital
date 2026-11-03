-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "folio" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledDate" TEXT NOT NULL,
    "scheduledTime" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "codeId" INTEGER,
    "configurationId" INTEGER NOT NULL,
    "medicalProcedureName" TEXT NOT NULL,
    "configurationCode" TEXT NOT NULL,
    "procedureType" TEXT NOT NULL,
    "anesthesiaType" TEXT NOT NULL,
    "stayType" TEXT NOT NULL,
    "totalUsd" DECIMAL(65,30) NOT NULL,
    "totalMxn" DECIMAL(65,30) NOT NULL,
    "discountAmount" DECIMAL(65,30) NOT NULL,
    "discountPercentage" DECIMAL(65,30) NOT NULL,
    "exchangeRate" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItems" (
    "id" SERIAL NOT NULL,
    "quoteId" INTEGER NOT NULL,
    "productId" INTEGER,
    "categoryId" INTEGER,
    "productName" TEXT NOT NULL,
    "productPrice" DECIMAL(65,30) NOT NULL,
    "productQuantity" INTEGER NOT NULL,

    CONSTRAINT "QuoteItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_id_key" ON "Quote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_folio_key" ON "Quote"("folio");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItems" ADD CONSTRAINT "QuoteItems_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItems" ADD CONSTRAINT "QuoteItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
