import prisma from "@/lib/prisma";

/**
 * Funcion para obtener todas las categorias
 * @returns todas las categorias en la base de datos
 */
export async function getAllCategories(){
    const categories = await prisma.category.findMany()

    const sortedCategories = categories.sort((a,b)=>a.name.localeCompare(b.name))

    return sortedCategories
}

/**
 * Controlador para crear una categoria
 * @param data informacion de la categoria a crear (nombre)
 */
export async function createCategory(data:any){
    //validar que no exista una con el mismo nombre
    const exists = await prisma.category.findFirst({
        where: {
            name: data.name
        }
    })

    if(exists) throw new Error("Ya existe una categoría con ese nombre.")
    
    //creacion de la categoria
    await prisma.category.create({
        data: {
            name: data.name,
            active: true
        }
    })
}

/**
 * Controlador para eliminar una categoria
 * @param id id de la categoria a eliminar
 */
export async function deleteCategory(id:number){
    const exists = await prisma.category.findFirst({
        where: {
            id: id
        }
    })

    if(!exists) throw new Error("Categoría no encontrada.")

    await prisma.category.delete({
        where: {
            id: id
        }
    })
}

/**
 * Controlador para activar/desactivar categoría
 * @param id id de la categoria a activar/desactivar
 */
export async function changeCategoryStatus(id:number){
    //validación de que exista la categoría
    const category = await prisma.category.findFirst({
        where: {
            id: id
        }
    })

    if(!category) throw new Error("No se encontró la categoría.")

    //asignación de nuevo status
    let newStatus = false
    if(category.active===false) newStatus = true
    
    //modificación en bd
    await prisma.category.update({
        where: {
            id: id
        },
        data: {
            active: newStatus
        }
    })
}

/**
 * Controlador para editar una categoría
 * @param id id de la categoría a modificar
 * @param data nombre nuevo para la categoría
 */
export async function updateCategory(id:number,data:any){
    let exists = await prisma.category.findFirst({
        where: {
            id:id
        }
    })

    if(!exists) throw new Error("No se encontró la categoría.")

    exists = await prisma.category.findFirst({
        where: {
            name: data.name
        }
    })
    
    if(exists && exists.id!==id) throw new Error("Ya existe otra categoría con ese nombre.")

    await prisma.category.update({
        where: {
            id: id
        },
        data: {
            name: data.name
        }
    })
}

export async function createManyCategories(data:any){
    await prisma.category.createMany({
        data: data.map((d:string)=>({
            name: d.trim().toUpperCase(),
            active: true
        }))
    })
}