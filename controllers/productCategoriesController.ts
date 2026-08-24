import prisma from "@/lib/prisma";

export async function getAllProductCategories(){
    return await prisma.productCategory.findMany()
}