import prisma from "@/lib/prisma";

export async function getAllConfigurationCategories(){
    return await prisma.configurationCategories.findMany()
}