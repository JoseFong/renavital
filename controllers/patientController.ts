import prisma from "@/lib/prisma";

export async function createManyPatients(data: any) {
    const now = new Date()
    const dateString = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + (now.getDate()).toString().padStart(2, "0")

    await prisma.patient.createMany({
        data: data.map((d: any) => ({
            firstName: d.name,
            lastName: d.lastName,
            secondLastName: d.secondLastName,

            birthday: d.birthday,
            gender: d.gender,
            curp: d.curp,

            email: d.email,
            countryCode: d.countryCode,
            phone: d.phone,
            secondaryPhone: d.secondaryPhone,

            country: d.country,
            state: d.state,
            city: d.city,
            address: d.address,

            bloodType: d.bloodType,
            profession: d.profession,
            language: d.language,
            civilState: d.civilState,

            registeredAt: dateString
        }))
    })
}

export async function createPatient(data: any) {
    const now = new Date()
    const dateString = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + (now.getDate()).toString().padStart(2, "0")

    let exists = await prisma.patient.findFirst({
        where: {
            OR: [
                {
                    phone: data.phone
                },
                {
                    secondaryPhone: data.phone
                }
            ]
        }
    })
    if (exists) throw new Error("Ya existe otro paciente con ese número telefónico.")

    if (data.secondaryPhone) {
        exists = await prisma.patient.findFirst({
            where: {
                OR: [
                    {
                        phone: data.secondaryPhone
                    },
                    {
                        secondaryPhone: data.secondaryPhone
                    }
                ]
            }
        })
        if (exists) throw new Error("Ya existe otro paciente con ese número telefónico.")
    }

    if (data.curp) {
        exists = await prisma.patient.findFirst({
            where: {
                curp: data.curp
            }
        })
        if (exists) throw new Error("Ya existe otro paciente con esa misma CURP.")
    }


    await prisma.patient.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            secondLastName: data.secondLastName,

            birthday: data.birthday,
            gender: data.gender,
            curp: data.curp,

            email: data.email,
            countryCode: data.countryCode,
            phone: data.phone,
            secondaryPhone: data.secondaryPhone,

            country: data.country,
            state: data.state,
            city: data.city,
            address: data.address,

            bloodType: data.bloodType,
            profession: data.profession,
            civilState: data.civilState,
            language: data.language,

            observations: data.observations,

            registeredAt: dateString
        }
    })
}

export async function getAllPatients() {
    return await prisma.patient.findMany()
}

export async function deletePatient(id: number) {
    let exists = await prisma.patient.findFirst({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró el paciente.")

    await prisma.patient.delete({
        where: {
            id: id
        }
    })
}

export async function updatePatient(id: number, data: any) {
    let exists = await prisma.patient.findFirst({
        where: {
            id: id
        }
    })

    if (!exists) throw new Error("No se encontró el paciente.")

    // Validar teléfono principal
    exists = await prisma.patient.findFirst({
        where: {
            OR: [
                {
                    phone: data.phone
                },
                {
                    secondaryPhone: data.phone
                }
            ]
        }
    })

    if (exists && exists.id !== id) {
        throw new Error("Ya existe otro paciente con ese número telefónico.")
    }

    // Validar teléfono secundario
    if (data.secondaryPhone) {
        exists = await prisma.patient.findFirst({
            where: {
                OR: [
                    {
                        phone: data.secondaryPhone
                    },
                    {
                        secondaryPhone: data.secondaryPhone
                    }
                ]
            }
        })

        if (exists && exists.id !== id) {
            throw new Error("Ya existe otro paciente con ese número telefónico.")
        }
    }

    // Validar CURP
    if (data.curp) {
        exists = await prisma.patient.findFirst({
            where: {
                curp: data.curp
            }
        })

        if (exists && exists.id !== id) {
            throw new Error("Ya existe otro paciente con esa misma CURP.")
        }
    }

    await prisma.patient.update({
        where: {
            id: id
        },
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            secondLastName: data.secondLastName,

            birthday: data.birthday,
            gender: data.gender,
            curp: data.curp,

            email: data.email,
            countryCode: data.countryCode,
            phone: data.phone,
            secondaryPhone: data.secondaryPhone,

            country: data.country,
            state: data.state,
            city: data.city,
            address: data.address,

            bloodType: data.bloodType,
            profession: data.profession,
            civilState: data.civilState,
            language: data.language,

            observations: data.observations
        }
    })
}

export async function getPatientById(id:number){
    const patient = await prisma.patient.findFirst({
        where: {
            id: id
        }
    })
    if(!patient) throw new Error("No se encontró el paciente.")
    
    return patient
}
