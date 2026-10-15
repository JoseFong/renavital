import prisma from "@/lib/prisma";

export async function getAllUsers(){
    return await prisma.user.findMany()
}

export async function createUser(data:any){

}