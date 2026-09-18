import prisma from "@/lib/prisma";

export async function getAllSpecialties() {
    return await prisma.specialty.findMany()
}

export async function createSpecialty(data: any) {
    let exists = await prisma.specialty.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists) throw new Error("Ya existe una especialidad con ese nombre.")

    await prisma.specialty.create({
        data: {
            name: data.name
        }
    })
}

export async function updateSpecialty(id: number, data: any) {
    let exists

    exists = await prisma.specialty.findFirst({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró la especialidad.")

    exists = await prisma.specialty.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists && exists.id!==id) throw new Error("Ya existe una especialidad con ese nombre.")

    await prisma.specialty.update({
        where: {
            id: id
        },
        data: {
            name: data.name
        }
    })
}

export async function deleteSpecialty(id:number){
    let exists

    exists = await prisma.specialty.findFirst({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró la especialidad.")

    await prisma.specialty.delete({
        where: {
            id: id
        }
    })
}

export async function getSpecialtyById(id:number){
    return await prisma.specialty.findFirst({
        where: {
            id: id
        },
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

export async function getDoctorsWithSpecialty(id:number){
    const doctors = await prisma.doctor.findMany({
        include: {
            doctorSpecialties: true
        }
    })

    const filtered = doctors.filter((d)=>d.doctorSpecialties.some((ds)=>ds.specialtyId===id))

    return filtered
}

export async function getAllSpecialtiesInfo(){
    return await prisma.specialty.findMany({
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

export async function assignDoctorsToSpecialty(id:number,doctorIds:number[]){
    let exists 

    exists = await prisma.specialty.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró esa especialidad.")

    await prisma.doctorSpecialty.deleteMany({
        where:{
            specialtyId: id
        }
    })

    await prisma.doctorSpecialty.createMany({
        data: doctorIds.map((i)=>({
            specialtyId: id,
            doctorId: i
        }))
    })
}

export async function createManySpecialties(data:any){
    await prisma.specialty.createMany({
        data: data.map((d:any)=>({
            name: d.name
        }))
    })
}