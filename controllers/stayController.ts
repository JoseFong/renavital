import prisma from "@/lib/prisma";

/**
 * Controlador para crear un tipo de estancia
 * @param data datos del nuevo tipo de estancia
 */
export async function createStay(data:any){
    //validar que no exista otro tipo de estancia con ese nombre
    let exists = await prisma.stay.findFirst({
        where: {
            name: data.name
        }
    })
    if(exists) throw new Error("Ya existe un tipo de estancia con ese nombre.")

    //validar que no exista otro tipo de estancia con ese código
    exists = await prisma.stay.findFirst({
        where: {
            code: data.code
        }
    })
    if(exists) throw new Error("Ya existe un tipo de estancia con ese código.")
    
    //crear tipo de estancia
    await prisma.stay.create({
        data: {
            code: data.code,
            name: data.name,
            active: true
        }
    })
}

/**
 * Controlador para consultar todos los tipos de estancia
 * @returns todos los tipos de estancia
 */
export async function getAllStays(){
    return await prisma.stay.findMany()
}

/**
 * Controlador para actualizar información de un tipo de estancia
 * @param id id del tipo de estancia a actualizar
 * @param data informacion nueva para el tipo de estancia
 */
export async function updateStay(id:number,data:any){
    //validar que el tipo de estancia exista
    let exists = await prisma.stay.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de estancia.")

    //validar que no exista otro tipo de estancia con ese nombre
    exists = await prisma.stay.findFirst({
        where: {
            name: data.name
        }
    })
    if(exists && exists.id!==id) throw new Error("Ya existe un tipo de estancia con ese nombre.")

    //validar que no exista otro tipo de estancia con ese código
    exists = await prisma.stay.findFirst({
        where: {
            code: data.code
        }
    })
    if(exists && exists.id!==id) throw new Error("Ya existe un tipo de estancia con ese código.")

    //actualizar informacion del tipo de estancia
    await prisma.stay.update({
        where: {
            id: id
        },
        data: {
            code: data.code,
            name: data.name
        }
    })
}

/**
 * Controlador para modificar el estado de un tipo de estancia
 * @param id id del tipo de estancia a modificar su estado
 */
export async function updateStayStatus(id:number){
    //validar que el tipo de estancia exista
    let exists = await prisma.stay.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de estancia.")

    //actualizar estado del tipo de estancia
    await prisma.stay.update({
        where: { 
            id: id
        },
        data: {
            active: !exists.active
        }
    })
}

/**
 * Controlador para eliminar un tipo de estancia
 * @param id id del tipo de estancia a eliminar
 */
export async function deleteStay(id:number){
    //validar que el tipo de estancia exista
    let exists = await prisma.stay.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de estancia.")

    //eliminar el tipo de estancia
    await prisma.stay.delete({
        where: {
            id: id
        }
    })
}

export async function getActiveStays(){
    return await prisma.stay.findMany({
        where: {
            active: true
        }
    })
}