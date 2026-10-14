import prisma from "@/lib/prisma";

export async function getAllMedicalProcedures() {
    return await prisma.medicalProcedure.findMany({
        include: {
            medicalProcedureConfigurations: {
                include: {
                    configuration: {
                        include: {
                            procedure: true,
                            anesthesia: true,
                            stay: true
                        }
                    }
                }
            },
            medicalProcedureSpecialties: {
                include: {
                    specialty: true
                }
            }
        }
    })
}

export async function createMedicalProcedure(data: any) {
    let exists = await prisma.medicalProcedure.findFirst({
        where: {
            code: data.code
        }
    })
    if (exists) throw new Error("Ya existe un procedimiento con ese código.")

    exists = await prisma.medicalProcedure.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists) throw new Error("Ya existe un procedimiento con ese nombre.")

    const created = await prisma.medicalProcedure.create({
        data: {
            code: data.code,
            name: data.name,
            active: true
        }
    })

    if (data.configurationIds && data.configurationIds.length > 0) {
        await prisma.medicalProcedureConfiguration.createMany({
            data: data.configurationIds.map((ci: number) => ({
                configurationId: ci,
                medicalProcedureId: created.id
            }))
        })
    }
}

export async function updateMedicalProcedure(id: number, data: any) {
    let exists

    console.log(data)

    exists = await prisma.medicalProcedure.findUnique({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró el procedimiento.")

    exists = await prisma.medicalProcedure.findFirst({
        where: {
            code: data.code
        }
    })
    if (exists && exists.id !== id) throw new Error("Ya existe un procedimiento con ese código.")

    exists = await prisma.medicalProcedure.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists && exists.id !== id) throw new Error("Ya existe un procedimiento con ese nombre.")

    await prisma.medicalProcedure.update({
        where: {
            id: id
        },
        data: {
            name: data.name,
            code: data.code
        }
    })
}

export async function createManyMedicalProcedures(data: any) {
    await prisma.medicalProcedure.createMany({
        data: data.map((d: any) => ({
            code: d.code,
            name: d.name,
            active: true
        }))
    })
}

export async function updateMedicalProcedureStatus(id: number) {
    const medicalProcedure = await prisma.medicalProcedure.findUnique({
        where: {
            id: id
        }
    })
    if (!medicalProcedure) throw new Error("No se encontró el procedimiento médico específico.")

    await prisma.medicalProcedure.update({
        where: {
            id: id
        },
        data: {
            active: !medicalProcedure.active
        }
    })
}

export async function getMedicalProcedureById(id: number) {
    return await prisma.medicalProcedure.findUnique({
        where: {
            id: id
        },
        include: {
            medicalProcedureConfigurations: {
                include: {
                    configuration: {
                        include: {
                            procedure: true,
                            stay: true,
                            anesthesia: true
                        }
                    }
                }
            },
            medicalProcedureSpecialties: {
                include: {
                    specialty: true
                }
            }
        }
    })
}

export async function assignConfigurationsToMedicalProcedure(id: number, configurationIds: number[]) {
    let exists = await prisma.medicalProcedure.findUnique({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró el procedimiento médico.")

    await prisma.$transaction(async (tx) => {
        await tx.medicalProcedureConfiguration.deleteMany({
            where: {
                medicalProcedureId: id
            }
        })

        await tx.medicalProcedureConfiguration.createMany({
            data: configurationIds.map((ci) => ({
                medicalProcedureId: id,
                configurationId: ci
            }))
        })
    })
}

export async function assignSpecialtyToMedicalProcedure(id:number,specialtyIds:number[]){
    let exists = await prisma.medicalProcedure.findUnique({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el procedimiento médico.")

    await prisma.$transaction(async(tx)=>{
        await tx.medicalProcedureSpecialty.deleteMany({
            where: {
                medicalProcedureId: id
            }
        })

        await tx.medicalProcedureSpecialty.createMany({
            data: specialtyIds.map((si)=>({
                specialtyId: si,
                medicalProcedureId: id
            }))
        })
    })
}