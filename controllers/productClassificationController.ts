import prisma from "@/lib/prisma";

export async function getAllProductClassifications() {
    return await prisma.productClassification.findMany()
}

export async function getProductClassificationFromId(id: number) {
    return await prisma.productClassification.findFirst({
        where: {
            id: id
        }
    })
}

export async function createProductClassification(data: any) {
    let exists
    exists = await prisma.productClassification.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists) throw new Error("Ya existe una clasificación con ese nombre.")

    if (data.parentId !== null) {
        exists = await prisma.productClassification.findFirst({
            where: {
                id: data.parentId
            }
        })
        if (!exists) throw new Error("No existe la categoría padre para esta subclasificación.")
    }

    await prisma.productClassification.create({
        data: {
            name: data.name,
            parentId: data.parentId
        }
    })
}

export async function updateClassification(id: number, data: any) {
    let exists

    exists = await prisma.productClassification.findFirst({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró la clasificación.")

    exists = await prisma.productClassification.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists) throw new Error("Ya existe una clasificación con ese nombre.")

    await prisma.productClassification.update({
        where: {
            id: id
        },
        data: {
            name: data.name
        }
    })
}

export async function deleteClassification(id: number) {
    let idsToDelete = [id]
    let currentIds = [id]

    while (currentIds.length > 0) {
        const children = await prisma.productClassification.findMany({
            where: {
                parentId: {
                    in: currentIds
                }
            },
            select: {
                id: true
            }
        })

        currentIds = children.map(c => c.id)
        idsToDelete.push(...currentIds)
    }

    await prisma.productClassification.deleteMany({
        where: {
            id: {
                in: idsToDelete
            }
        }
    })
}

export async function getProductsForClassification(id: number) {
    return await prisma.product.findMany({
        where: {
            OR: [
                {
                    productClassificationId: id
                },
                {
                    productClassificationId: null
                }
            ]
        }
    })
}

export async function assignProductsToClassification(id: number, productIds: number[]) {
    let exists = await prisma.productClassification.findFirst({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró la clasificación.")

    await prisma.$transaction([
        prisma.product.updateMany({
            where: {
                productClassificationId: id
            },
            data: {
                productClassificationId: null
            }
        }),

        prisma.product.updateMany({
            where: {
                id: {
                    in: productIds
                }
            },
            data: {
                productClassificationId: id
            }
        })
    ])
}