import { createRandomCode } from "@/lib/createCode";
import prisma from "@/lib/prisma";

export async function getAllUsers() {
    return await prisma.user.findMany({
        include: {
            userRole: true,
            doctor: true
        }
    })
}

export async function createUser(data: any) {
    let exists

    exists = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })
    if (exists) throw new Error("Ya existe otro usuario con ese nombre de usuario.")

    exists = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })
    if (exists) throw new Error("Ya existe un usuario con ese correo.")

    if (data.doctorId) {
        exists = await prisma.user.findFirst({
            where: {
                doctorId: data.doctorId
            }
        })
        if (exists) throw new Error("Ya existe un usuario asociado a ese médico.")
    }

    const code = createRandomCode(6)

    await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            userRoleId: data.userRoleId,
            doctorId: data.doctorId,
            requireEmailCode: data.requireEmailCode,
            restrictByIp: data.restrictByIp,
            active: true,
            pendingPasswordSetup: true,
            code: code,
            passwordHash: "PENDING"
        }
    })
}

export async function getUserById(id:number) {
    return await prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            userRole: true,
            doctor: true
        }
    })
}

export async function updateUser(id:number,data: any) {
    console.log(data)

    let exists

    exists = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if(!exists) throw new Error("No se encontró el usuario a actualizar.")

    exists = await prisma.user.findFirst({
        where: {
            username: data.username
        }
    })
    if (exists && exists.id!==id) throw new Error("Ya existe otro usuario con ese nombre de usuario.")

    exists = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })
    if (exists && exists.id!==id) throw new Error("Ya existe un usuario con ese correo.")

    if (data.doctorId) {
        exists = await prisma.user.findFirst({
            where: {
                doctorId: data.doctorId
            }
        })
        if (exists && exists.id!==id) throw new Error("Ya existe un usuario asociado a ese médico.")
    }

    await prisma.user.update({
        where:{
            id: id
        },
        data: {
            username: data.username,
            email: data.email,
            userRoleId: data.userRoleId,
            doctorId: data.doctorId,
            requireEmailCode: data.requireEmailCode,
            restrictByIp: data.restrictByIp
        }
    })
}

export async function updateUserStatus(id:number){
    let user

    user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    if(!user) throw new Error("No se encontró el usuario a actualizar.")

    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            active: !user.active
        }
    })
}