import prisma from "@/lib/prisma";

/**
 * 
 * @returns todos los productos
 */
export async function getAllProducts() {
    const products = await prisma.product.findMany({
        include: {
            productCategories: {
                include: {
                    category: true
                }
            },
            productClassification: true
        }
    })

    return products
}

/**
 * Controlador para eliminar un producto
 * @param id id del producto a eliminar
 */
export async function deleteProduct(id: number) {
    //validar que el producto exista
    const exists = await prisma.product.findFirst({
        where: {
            id: id
        }
    })

    if (!exists) throw new Error("No se encontró el producto.")

    //eliminar el producto
    await prisma.product.delete({
        where: {
            id: id
        }
    })
}

/**
 * Controlador para cambiar el estado del producto (activo/no activo)
 * @param id id del producto a actualizar
 */
export async function updateProductStatus(id: number) {
    //validar que el producto exista
    const exists = await prisma.product.findFirst({
        where: {
            id: id
        }
    })

    if (!exists) throw new Error("No se encontró el producto.")

    //cambiar estado
    await prisma.product.update({
        where: {
            id: id
        },
        data: {
            active: !exists.active
        }
    })
}

/**
 * Controlador para crear un producto
 * @param data datos del nuevo producto
 */
export async function createProduct(data: any) {
    let exists

    console.log(data)
    
    //validar que no exista otro producto con ese mismo nombre
    exists = await prisma.product.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists) throw new Error("Ya existe otro producto con ese nombre.")

    if(data.productClassificationId){
        exists = await prisma.productClassification.findFirst({
            where: {
                id: data.productClassificationId
            }
        })
        if(!exists) throw new Error("No se encontró la clasificación.")
    }

    //crear producto
    await prisma.product.create({
        data: {
            name: data.name,
            equipment: data.equipment,
            service: data.service,
            price: data.price,
            active: true,
            productClassificationId: data.productClassificationId
        }
    })
}

/**
 * Controlador para consultar un producto
 * @param id id del producto
 * @returns producto encontrado
 */
export async function getProductFromId(id: number) {
    const product = await prisma.product.findFirst({
        where: {
            id: id
        }
    })

    if (!product) throw new Error("No se encontró el producto.")

    return product
}

/**
 * Controlador para actualizar producto
 * @param id id del producto a actualizar
 * @param data informacion nueva del producto
 */
export async function updateProduct(id: number, data: any) {
    let exists

    //validar que el producto exista
    exists = await prisma.product.findFirst({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró el producto.")
    
    if(data.productClassificationId){
        exists = await prisma.productClassification.findFirst({
            where: {
                id: data.productClassificationId
            }
        })
        if(!exists) throw new Error("No se encontró la clasificación del producto.")
    }

    //actualizar producto
    await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name: data.name,
            equipment: data.equipment,
            price: data.price,
            service: data.service,
            productClassificationId: data.productClassificationId
        }
    })
}

export async function getProductsWithCategory(){
    const products = await prisma.product.findMany({
        include: {
            productCategories: true
        }
    })
    return products
}


export async function deleteManyProducts(ids:number[]){
    await prisma.product.deleteMany({
        where: {
            id: {
                in: ids
            }
        }
    })
}


export async function createManyProducts(data:any){
    await prisma.product.createMany({
        data: data.map((d:any)=>({
            productTypeId: d.productTypeId,
            name: d.name,
            equipment: d.equipment,
            service: d.service,
            price: d.price,
            active: true
        }))
    })
}

export async function getActiveProducts(){
    return await prisma.product.findMany({
        where: {
            active: true
        }
    })
}

export async function getInactiveProducts(){
    return await prisma.product.findMany({
        where: {
            active: false
        }
    })
}

export async function unassignAllProductTypes(){
    await prisma.product.updateMany({
        data: {
            productTypeId: null
        }
    })
}