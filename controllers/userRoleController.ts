import prisma from "@/lib/prisma";

export async function getAllUserRoles() {
    return await prisma.userRole.findMany({
        include: {
            users: true
        }
    })
}

export async function createUserRole(data: any) {
    let exists = await prisma.userRole.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists) throw new Error("Ya existe un rol de usuario con ese nombre.")

    await prisma.userRole.create({
        data: {
            name: data.name,
            permissions: data.permissions
        }
    })
}

export async function updateUserRole(id: number, data: any) {
    let exists = await prisma.userRole.findUnique({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró el rol de usuario a actualizar.")

    exists = await prisma.userRole.findFirst({
        where: {
            name: data.name
        }
    })
    if (exists && exists.id!==id) throw new Error("Ya existe un rol de usuario con ese nombre.")

    await prisma.userRole.update({
        where: {
            id: id
        },
        data: {
            name: data.name
        }
    })
}

export async function updateUserRolePermissions(id:number,permissions:string[]){
    let exists = await prisma.userRole.findUnique({
        where: {
            id: id
        }
    })
    if (!exists) throw new Error("No se encontró el rol de usuario a actualizar.")

    await prisma.userRole.update({
        where: {
            id: id
        },
        data: {
            permissions: permissions
        }
    })
}

export async function getUserRoleById(id:number){
    let exists = await prisma.userRole.findUnique({
        where: {
            id: id
        },
        include:{
            users: true
        }
    })
    if (!exists) throw new Error("No se encontró el rol de usuario a actualizar.")

    return exists
}