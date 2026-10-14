-- CreateTable
CREATE TABLE "MedicalProcedureSpecialty" (
    "id" SERIAL NOT NULL,
    "medicalProcedureId" INTEGER NOT NULL,
    "specialtyId" INTEGER NOT NULL,

    CONSTRAINT "MedicalProcedureSpecialty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicalProcedureSpecialty" ADD CONSTRAINT "MedicalProcedureSpecialty_medicalProcedureId_fkey" FOREIGN KEY ("medicalProcedureId") REFERENCES "MedicalProcedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalProcedureSpecialty" ADD CONSTRAINT "MedicalProcedureSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
