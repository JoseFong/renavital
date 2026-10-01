-- CreateTable
CREATE TABLE "Code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "singleUse" BOOLEAN NOT NULL,
    "maxUses" INTEGER NOT NULL,
    "startDate" TEXT,
    "endDate" TEXT,
    "appliesToTotal" BOOLEAN NOT NULL,
    "discountType" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "valid" BOOLEAN NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeUsage" (
    "id" SERIAL NOT NULL,
    "codeId" INTEGER NOT NULL,
    "doctorId" INTEGER,
    "patientId" INTEGER,
    "numberOfUses" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL,

    CONSTRAINT "CodeUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");

-- AddForeignKey
ALTER TABLE "CodeUsage" ADD CONSTRAINT "CodeUsage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeUsage" ADD CONSTRAINT "CodeUsage_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
