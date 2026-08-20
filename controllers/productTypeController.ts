import prisma from "@/lib/prisma";

/**
 * Controlador para consultar todos los tipos de producto
 * @returns todos los tipos de producto existentes
 */
export async function getAllProductTypes(){
    const productTypes = await prisma.productType.findMany()
    const sorted = productTypes.sort((a,b)=>a.name.localeCompare(b.name))
    return sorted
}

/**
 * Controlador para crear un tipo de producto
 * @param data datos del nuevo tipo de producto
 */
export async function createProductType(data:any){
    //validar que no exista un producto con ese nombre
    let exists = await prisma.productType.findFirst({
        where: {
            name: data.name
        }
    })
    if(exists) throw new Error("Ya existe un tipo de producto con este nombre.")

    //crear el tipo de producto
    await prisma.productType.create({
        data: {
            name: data.name,
            active: true
        }
    })
}

/**
 * Controlador para actualizar un tipo de producto
 * @param id id del tipo de producto a actualizar
 * @param data información nueva del tipo de producto
 */
export async function updateProductType(id:number,data:any){
    //validar que exista el tipo de producto
    let exists = await prisma.productType.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de producto.")

    //validar que no exista un tipo de producto con ese nombre
    exists = await prisma.productType.findFirst({
        where: {
            name: data.name
        }
    })
    if(exists && exists.id!==id) throw new Error("Ya existe un tipo de producto con este nombre.")

    //actualizar tipo de producto
    await prisma.productType.update({
        where: {
            id:id
        },
        data: {
            name: data.name
        }
    })
}

/**
 * Controlador para actualizar estado de tipo de producto (activo/inactivo)
 * @param id id del tipo de producto a actualizar su estado
 */
export async function updateProductTypeStatus(id:number){
    //validar que exista el tipo de producto
    let exists = await prisma.productType.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de producto.")

    //actualizar el estado
    await prisma.productType.update({
        where: {
            id:id
        },
        data: {
            active: !exists.active
        }
    })
}

/**
 * Controlador para eliminar un tipo de producto
 * @param id id del tipo de producto a eliminar
 */
export async function deleteProductType(id:number){
    //validar que exista el tipo de producto
    let exists = await prisma.productType.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el tipo de producto.")
    
    //eliminar el tipo de producto
    await prisma.productType.delete({
        where: {
            id: id
        }
    })
}

/**
 * @DANGER
 * Handler para crear muchos tipos de productos, usado para alimentar BD desde excel
 * @param data arreglo de strings que contiene los nombres de los tipos de productos a agregar
 */
export async function createManyProductTypes(data:any){
    await prisma.productType.createMany({
        data: data.map((d:any)=>({
            name: d,
            active: true
        }))
    })
}