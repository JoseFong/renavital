import prisma from "@/lib/prisma";

/**
 * Controlador para crear un tipo de procedimiento
 * @returns todos los tipos de procedimiento
 */
export async function getAllProcedures(){
    const procedures = await prisma.procedure.findMany()
    const sorted = procedures.sort((a,b)=>a.name.localeCompare(b.name))
    return sorted
}

/**
 * Controlador para crear tipo de procedimiento
 * @param data datos del procedimiento nuevo
 */
export async function createProcedure(data:any){
    //validar que no exista otro tipo de procedimiento con ese mismo nombre
    let exists = await prisma.procedure.findFirst({
        where: { 
            name: data.name
        }
    })
    if(exists) throw new Error("Ya existe otro tipo de procedimiento con ese mismo nombre.")

    //validar que no exista otro tipo de procedimiento con ese mismo codigo
    exists = await prisma.procedure.findFirst({
        where: {
            code: data.code
        }
    })
    if(exists) throw new Error("Ya existe otro tipo de procedimiento con ese mismo código.")

    //creacion de procedimiento
    await prisma.procedure.create({
        data: {
            name: data.name,
            code: data.code,
            active: true
        }
    })
}

/**
 * Controlador para actualizar un procedimiento
 * @param id id del procedimiento a actualizar
 * @param data informacion nueva del procedimiento
 */
export async function updateProcedure(id:number,data:any){
    //validar que el tipo de procedimiento exista
    let exists = await prisma.procedure.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de procedimiento.")

    //validar que no exista otro tipo de procedimiento con ese mismo nombre
    exists = await prisma.procedure.findFirst({
        where: { 
            name: data.name
        }
    })
    if(exists && exists.id!==id) throw new Error("Ya existe otro tipo de procedimiento con ese mismo nombre.")

    //validar que no exista otro tipo de procedimiento con ese mismo codigo
    exists = await prisma.procedure.findFirst({
        where: {
            code: data.code
        }
    })
    if(exists && exists.id!==id) throw new Error("Ya existe otro tipo de procedimiento con ese mismo código.")

    //creacion de procedimiento
    await prisma.procedure.update({
        where: {
            id: id
        },
        data: {
            name: data.name,
            code: data.code
        }
    })
}

/**
 * Controlador para eliminar un tipo de procedimiento
 * @param id id del procedimiento a eliminar
 */
export async function deleteProcedure(id:number){
    //validar que el tipo de procedimiento existe
    let exists = await prisma.procedure.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de procedimiento.")

    //eliminar tipo de procedimiento
    await prisma.procedure.delete({where:{id:id}})
}

/**
 * Controlador para actualizar el estado de un tipo de procedimiento
 * @param id id del tipo de procedimiento a actualizar su estado
 */
export async function updateProcedureStatus(id:number){
    //validar que el tipo de procedimiento existe
    let exists = await prisma.procedure.findFirst({
        where: {
            id:id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de procedimiento.")

    //cambiar el estado del procedimiento
    await prisma.procedure.update({
        where: {
            id: id
        },
        data: {
            active: !exists.active
        }
    })
}