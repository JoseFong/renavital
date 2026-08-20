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

/**
 * Controlador para consultar un tipo de producto con su id
 * @param id id del tipo de producto a fconsultar
 * @returns tipo de producto encontrado
 */
export async function getProductTypeFromId(id:number){
    return await prisma.productType.findFirst({
        where: {
            id:id
        }
    })
}

/**
 * Controlador para obtener los productos asignados a un tipo de producto o que no tengan un tipo de producto asignado
 * @param id id del tipo de producto
 * @returns productos que pertenezcan a este tipo O que no pertenezcan a ninguno
 */
export async function getProductsForProductType(id:number){
    const products = await prisma.product.findMany({
        where: {
            OR: [
                {
                    productTypeId: id
                },
                {
                    productType: null
                }
            ]
        }
    })
    return products
}

/**
 * Controlador para agregar varios productos a un tipo de producto
 * @param id id del tipo de producto
 * @param productIds arreglo de ids de los productos a modificar
 */
export async function assignProductTypeToProducts(id:number,productIds:number[]){
    //validar que el tipo de producto exista
    let exists = await prisma.productType.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No existe ese tipo de producto.")


    //cambiar la productTypeId de los productos
    await prisma.product.updateMany({
        where: {
            id: {
                in: productIds
            }
        },data:{
            productTypeId: id
        }
    })
}

export async function unassignProductTypeToProducts(id:number,productIds:number[]){
    //validar que el tipo de producto exista
    let exists = await prisma.productType.findFirst({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No existe ese tipo de producto.")

    //desasignar el tipo de producto al producto
    await prisma.product.updateMany({
        where:{
            id: {
                in: productIds
            }
        },
        data: {
            productTypeId: null
        }
    })
}