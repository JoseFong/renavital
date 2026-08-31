import prisma from "@/lib/prisma";

/**
 * Controlador para obtener todas las anestesias
 * @returns todas las anestesias registradas
 */
export async function getAllAnesthesias(){
    const anesthesias = await prisma.anesthesia.findMany()
    const sorted = anesthesias.sort((a,b)=>a.name.localeCompare(b.name))
    return sorted
}

/**
 * Controlador para crear tipo de anestesia
 * @param data datos de la anestesia nueva
 */
export async function createAnesthesia(data:any){
    //validar que no exista otro tipo de anestesia con ese mismo nombre
    let exists = await prisma.anesthesia.findFirst({
        where: { 
            name: data.name
        }
    })
    if(exists) throw new Error("Ya existe otro tipo de anestesia con ese mismo nombre.")

    //validar que no exista otro tipo de anestesia con ese mismo codigo
    exists = await prisma.anesthesia.findFirst({
        where: {
            code: data.code
        }
    })
    if(exists) throw new Error("Ya existe otro tipo de anestesia con ese mismo código.")

    await prisma.anesthesia.create({
        data: {
            name: data.name,
            code: data.code,
            active: true
        }
    })
}

/**
 * Controlador para eliminar un tipo de anestesia
 * @param id id del tipo de anestesia a eliminar
 */
export async function deleteAnestesia(id:number){
    await prisma.anesthesia.delete({
        where: {
            id: id
        }
    })
}

/**
 * Controlador para actualizar informacion de tipo de anestesia
 * @param id id del tipo de anestesia a actualizar
 * @param data informacion nueva para el tipo de anestesia
 */
export async function updateAnesthesia(id:number,data:any){
    //validar que el tipo de anestesia exista
    let exists = await prisma.anesthesia.findFirst({
        where: {
            id:id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de anestesia.")

    //validar que no exista otro tipo de anestesia con ese mismo nombre
    exists = await prisma.anesthesia.findFirst({
        where: { 
            name: data.name
        }
    })
    if(exists && exists.id!==id) throw new Error("Ya existe otro tipo de anestesia con ese mismo nombre.")

    //validar que no exista otro tipo de anestesia con ese mismo codigo
    exists = await prisma.anesthesia.findFirst({
        where: {
            code: data.code
        }
    })
    if(exists && exists.id!==id) throw new Error("Ya existe otro tipo de anestesia con ese mismo código.")

    //actualizar anestesia
    await prisma.anesthesia.update({
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
 * Controlador para cambiar el estado de un tipo de anestesia (activo/no activo)
 * @param id id del tipo de anestesia a actualizar
 */
export async function updateAnesthesiaStatus(id:number){
    //validar que el tipo de anestesia exista
    let exists = await prisma.anesthesia.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de anestesia.")

    //actualizar estado
    await prisma.anesthesia.update({
        where: {
            id: id
        },
        data: {
            active: !exists.active
        }
    })
}

export async function getActiveAnesthesias(){
    return await prisma.anesthesia.findMany({
        where: {
            active: true
        }
    })
}