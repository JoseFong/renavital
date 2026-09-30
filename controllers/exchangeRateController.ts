import prisma from "@/lib/prisma"

export async function createExchangeRate(data:any){
    let exists

    exists = await prisma.doctor.findUnique({
        where: {
            id: data.doctorId
        }
    })
    if(!exists) throw new Error("No se encontró el médico.")

    exists = await prisma.configuration.findUnique({
        where: {
            id: data.configurationId
        }
    })
    if(!exists) throw new Error("No se encontró la configuración.")

    await prisma.exchangeRate.create({
        data: {
            exchangeRate: data.exchangeRate,
            doctorId: data.doctorId,
            configurationId: data.configurationId
        }
    })
}

export async function updateExchangeRate(id:number,data:any){
    let exists

    exists = await prisma.exchangeRate.findUnique({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de cambio.")

    exists = await prisma.doctor.findUnique({
        where: {
            id: data.doctorId
        }
    })
    if(!exists) throw new Error("No se encontró el médico.")

    exists = await prisma.configuration.findUnique({
        where: {
            id: data.configurationId
        }
    })
    if(!exists) throw new Error("No se encontró la configuración.")

    await prisma.exchangeRate.update({
        where:{
            id: id
        },
        data: {
            exchangeRate: data.exchangeRate,
        }
    })
}

export async function deleteExchangeRate(id:number){
    let exists
    exists = await prisma.exchangeRate.findUnique({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de cambio.")

    await prisma.exchangeRate.delete({
        where: {
            id: id
        }
    })
}