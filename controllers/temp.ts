import prisma from "@/lib/prisma";

export async function createManyProuctCategories(data:any){
    await prisma.productCategory.createMany({
        data: data.map((d:any)=>({
            productId: d.productId,
            categoryId: d.categoryId,
            quantity: d.quantity
        }))
    })
}