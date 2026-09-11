-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "lastName" TEXT NOT NULL,
    "secondLastName" TEXT,
    "birthday" TEXT NOT NULL,
    "registeredAt" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "curp" TEXT,
    "email" TEXT,
    "countryCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "observations" TEXT,
    "bloodType" TEXT,
    "profession" TEXT,
    "civilState" TEXT,
    "language" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
