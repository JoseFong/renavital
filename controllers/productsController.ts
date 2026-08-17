import prisma from "@/lib/prisma";
import { exit } from "process";

/**
 * 
 * @returns todos los productos
 */
export async function getAllProducts() {    
    const products =  await prisma.product.findMany({
        include: {
            category: true
        }
    })
    const sorted = products.sort((a,b)=>a.name.localeCompare(b.name))
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

    //validar que la categoria exista
    if (data.categoryId !== -1) {
        exists = await prisma.category.findFirst({
            where: {
                id: data.categoryId
            }
        })

        if (!exists) throw new Error("La categoría no existe.")


    }

    //validar que no exista otro producto con ese mismo nombre
    exists = await prisma.product.findFirst({
        where: {
            name: data.name
        }
    })

    if (exists) throw new Error("Ya existe otro producto con ese nombre.")

    //asignar categoria si se selecciono ninguna
    let newCategoryId = null
    if (data.categoryId !== -1) newCategoryId = data.categoryId

    //crear producto
    await prisma.product.create({
        data: {
            name: data.name,
            flux: data.flux,
            equipment: data.equipment,
            service: data.service,
            quantity: data.quantity,
            price: data.price,
            categoryId: newCategoryId,
            active: true
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
    //validar que no exista otro producto con el mismo nombre
    let exists = await prisma.product.findFirst({
        where: {
            name: data.name
        }
    })

    if (exists && exists.id !== id) throw new Error("Ya existe un producto con ese nombre.")

    //validar que el producto exista
    exists = await prisma.product.findFirst({
        where: {
            id: id
        }
    })

    if (!exists) throw new Error("No se encontró el producto.")

    //validar que la categoría exista
    if (data.categoryId != -1) {
        let existscat = await prisma.category.findFirst({
            where: {
                id: data.categoryId
            }
        })

        if (!existscat) throw new Error("No se encontró la categoría.")
    }

    //extraer la categoria
    let newCategoryId = null
    if(data.categoryId!==-1){
        newCategoryId = data.categoryId
    }

    //actualizar producto
    await prisma.product.update({
        where: {
            id: id
        },
        data: {
            name: data.name,
            categoryId: newCategoryId,
            equipment: data.equipment,
            flux: data.flux,
            price: data.price,
            quantity: data.quantity,
            service: data.service
        }
    })
}
