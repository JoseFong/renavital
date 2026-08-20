import prisma from "@/lib/prisma";
import { exit } from "process";

/**
 * 
 * @returns todos los productos
 */
export async function getAllProducts() {
    const products = await prisma.product.findMany({
        include: {
            productType: true
        }
    })

    const sorted = products.sort((a, b) =>
        (a.productType?.name ?? "").localeCompare(b.productType?.name ?? "")
    )

    return sorted
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

    //validar que el tipo de producto exist
    if(data.productTypeId!==-1){
        exists = await prisma.productType.findFirst({
            where: {
                id: data.productTypeId
            }
        })
        if(!exists) throw new Error("No se encontró el tipo de producto.")
    }

    //validar que no exista otro producto con ese mismo nombre
    exists = await prisma.product.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists) throw new Error("Ya existe otro producto con ese nombre.")

    //asignar nueva id de tipo de producto
    let productTypeId = null
    if(data.productTypeId!==-1)
        productTypeId = data.productTypeId

    //crear producto
    await prisma.product.create({
        data: {
            name: data.name,
            equipment: data.equipment,
            service: data.service,
            price: data.price,
            active: true,
            productTypeId: productTypeId
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

    //validar que el tipo de producto exist
    if(data.productTypeId!==-1){
        exists = await prisma.productType.findFirst({
            where: {
                id: data.productTypeId
            }
        })
        if(!exists) throw new Error("No se encontró el tipo de producto.")
    }
    
    //asignar nueva id de tipo de producto
    let productTypeId = null
    if(data.productTypeId!==-1)
        productTypeId = data.productTypeId

    //actualizar producto
    await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name: data.name,
            productTypeId: productTypeId,
            equipment: data.equipment,
            price: data.price,
            service: data.service
        }
    })
}