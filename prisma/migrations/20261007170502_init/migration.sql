-- CreateTable
CREATE TABLE "MedicalProcedure" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "MedicalProcedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalProcedureConfiguration" (
    "id" SERIAL NOT NULL,
    "medicalProcedureId" INTEGER NOT NULL,
    "configurationId" INTEGER NOT NULL,

    CONSTRAINT "MedicalProcedureConfiguration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicalProcedureConfiguration" ADD CONSTRAINT "MedicalProcedureConfiguration_medicalProcedureId_fkey" FOREIGN KEY ("medicalProcedureId") REFERENCES "MedicalProcedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalProcedureConfiguration" ADD CONSTRAINT "MedicalProcedureConfiguration_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "Configuration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
