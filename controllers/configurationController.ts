import { Category, Configuration, ConfigurationCategories, Product } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getAllConfigurations(){
    const configurations = await prisma.configuration.findMany({
        include: {
            anesthesia: true,
            stay: true,
            procedure: true
        }
    })

    const sorted = configurations.sort((a,b)=>a.code.localeCompare(b.code))
    return sorted
}

export async function createConfiguration(data:any){
    let exists = await prisma.configuration.findFirst({
        where: {
            AND: [
                {
                    procedureId: data.procedureId
                },
                {
                    anesthesiaId: data.anesthesiaId
                },
                {
                    stayId: data.stayId
                }
            ]
        }
    })
    if(exists) throw new Error("Ya existe otra configuración similar, elimínela y vuelva a crearla para cambiar su configuración.")
    
    const configuration = await prisma.configuration.create({
        data: {
            code: data.code,
            procedureId: data.procedureId,
            anesthesiaId: data.anesthesiaId,
            stayId: data.stayId,
            active: true    
        }
    })

    console.log(data.selectedCategories)

    await prisma.configurationCategories.createMany({
        data: data.selectedCategories.map((sc:number)=>({
            configurationId: configuration.id,
            categoryId: sc,
            active: true
        }))
    })
}

export async function updateConfigurationStatus(id:number){
    let exists = await prisma.configuration.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró la configuración.")

    await prisma.configuration.update({
        where: {
            id: id
        },
        data: {
            active: !exists.active
        }
    })
}

export async function deleteConfiguration(id:number){
    let exists = await prisma.configuration.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró la configuración.")
    
    await prisma.configuration.delete({
        where: {
            id:id
        }
    })
}

export async function getConfiguationFromId(id:number){
    let exists = await prisma.configuration.findFirst({
        where: {
            id:id
        },
        include:{
            procedure: true,
            anesthesia: true,
            stay: true
        }
    })
    if(!exists) throw new Error("No se encontró la configuración.")

    return exists
}

export async function getCategoriesFromConfiguration(id:number){
    let exists = await prisma.configuration.findFirst({
        where: {
            id:id
        }
    })
    if(!exists) throw new Error("No se encontró la configuración.")

    const configurationCategories = await prisma.configurationCategories.findMany({
        where: {
            configurationId: id
        }
    })

    const category = await prisma.category.findMany()
    const filteredCategories = category.filter((c:Category)=>configurationCategories.some((cc:ConfigurationCategories)=>c.id===cc.categoryId))
    return filteredCategories
}