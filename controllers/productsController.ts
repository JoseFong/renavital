import prisma from "@/lib/prisma";

/**
 * 
 * @returns todos los productos
 */
export async function getAllProducts(){
    return await prisma.product.findMany({
        include: {
            category: true
        }
    })
}