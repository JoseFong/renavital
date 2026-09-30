import prisma from "@/lib/prisma";

export async function createDoctor(data: any) {
    let exists

    if (data.curp) {
        exists = await prisma.doctor.findFirst({
            where: {
                curp: data.curp
            }
        })
        if (exists) throw new Error("Ya existe otro médico con esta CURP.")

    }

    if (data.rfc) {
        exists = await prisma.doctor.findFirst({
            where: {
                rfc: data.rfc
            }
        })
        if (exists) throw new Error("Ya existe otro médico con este RFC.")
    }

    exists = await prisma.doctor.findFirst({
        where: {
            licenseNumber: data.licenseNumber
        }
    })
    if (exists) throw new Error("Ya existe otro médico con esta cédula profesional.")


    exists = await prisma.doctor.findFirst({
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
    if (exists) throw new Error("Ya existe un médico con ese número telefónico.")

    if (data.secondaryPhone) {
        exists = await prisma.doctor.findFirst({
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
        if (exists) throw new Error("Ya existe un médico con ese número telefónico.")
    }

    const now = new Date()

    const dateString =
        now.getFullYear() +
        "-" +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        now.getDate().toString().padStart(2, "0")

    console.log(data)

    const doctor = await prisma.doctor.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            secondLastName: data.secondLastName,

            gender: data.gender,
            curp: data.curp,
            rfc: data.rfc,

            country: data.country,
            state: data.state,
            city: data.city,
            address: data.address,

            email: data.email,
            countryCode: data.countryCode,
            phone: data.phone,
            secondaryPhone: data.secondaryPhone,

            university: data.university,
            licenseNumber: data.licenseNumber,

            observations: data.observations,

            registeredAt: dateString,

            defaultExchangeRate: Number(data.defaultExchangeRate)
        }
    })

    await prisma.doctorSpecialty.createMany({
        data: data.specialtyIds.map((si:number)=>({
            doctorId: doctor.id,
            specialtyId: si
        }))
    })
}

export async function getAllDoctors() {
    return await prisma.doctor.findMany({
        include: {
            doctorSpecialties: {
                include: {
                    doctor: true,
                    specialty: true
                }
            }
        }
    })
}

export async function createManyDoctors(datas: any) {
    const now = new Date()
    const dateString = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0")


    await prisma.doctor.createMany({
        data: datas.map((d: any) => ({
            firstName: d.firstName,
            lastName: d.lastName,
            secondLastName: d.secondLastName,

            gender: d.gender,
            curp: d.curp,
            rfc: d.rfc,

            country: d.country,
            state: d.state,
            city: d.city,
            address: d.address,

            email: d.email,
            countryCode: d.countryCode,
            phone: d.phone,
            secondaryPhone: d.secondaryPhone,

            university: d.university,
            licenseNumber: d.licenseNumber,

            observations: d.observations,

            defaultExchangeRate: d.defaultExchangeRate,

            registeredAt: dateString
        }))
    })
}

export async function getDoctorFromId(id: number) {
    return await prisma.doctor.findFirst({
        where: {
            id: id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialty: true
                }
            },
            exchangeRates: {
                include: {
                    configuration: {
                        include: {
                            anesthesia: true,
                            stay: true,
                            procedure: true
                        }
                    }
                }
            }
        }
    })
}

export async function updateDoctor(id:number,data:any){
    let exists

    exists = await prisma.doctor.findUnique({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró al médico.")

    if (data.curp) {
        exists = await prisma.doctor.findFirst({
            where: {
                curp: data.curp
            }
        })
        if (exists && exists.id!==id) throw new Error("Ya existe otro médico con esta CURP.")

    }

    if (data.rfc) {
        exists = await prisma.doctor.findFirst({
            where: {
                rfc: data.rfc
            }
        })
        if (exists && exists.id!==id) throw new Error("Ya existe otro médico con este RFC.")
    }

    exists = await prisma.doctor.findFirst({
        where: {
            licenseNumber: data.licenseNumber
        }
    })
    if (exists && exists.id!==id) throw new Error("Ya existe otro médico con esta cédula profesional.")


    exists = await prisma.doctor.findFirst({
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
    if (exists && exists.id!==id) throw new Error("Ya existe un médico con ese número telefónico.")

    if (data.secondaryPhone) {
        exists = await prisma.doctor.findFirst({
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
        if (exists && exists.id!==id) throw new Error("Ya existe un médico con ese número telefónico.")
    }

    await prisma.doctor.update({
        where:{
            id: id
        },
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            secondLastName: data.secondLastName,

            gender: data.gender,
            curp: data.curp,
            rfc: data.rfc,

            country: data.country,
            state: data.state,
            city: data.city,
            address: data.address,

            email: data.email,
            countryCode: data.countryCode,
            phone: data.phone,
            secondaryPhone: data.secondaryPhone,

            university: data.university,
            licenseNumber: data.licenseNumber,

            observations: data.observations,

            defaultExchangeRate: Number(data.defaultExchangeRate)
        }
    })

    await prisma.doctorSpecialty.deleteMany({
        where: {
            doctorId: id
        }
    })

    await prisma.doctorSpecialty.createMany({
        data: data.specialtyIds.map((si:number)=>({
            doctorId: id,
            specialtyId: si
        }))
    })
}