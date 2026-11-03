import { createRandomCode } from "@/lib/createCode";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

    let code = ""
    do{
        let exists = false
        code = createRandomCode(6)
        const userTest = await prisma.user.findFirst({where:{code:code}})
        if(userTest) exists = true 
    }while(exists)
    

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

export async function getUserByCodeForActivation(code:string){
    const user = await prisma.user.findFirst({
        where: {
            code: code,
            pendingPasswordSetup: true
        }
    })

    if(!user) throw new Error("No se encontró el usuario.")

    return user
}

export async function updateUserPassword(id:number,password:string){
    const hashed = await bcrypt.hash(password,12)
    
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            passwordHash: hashed
        }
    })
}

export async function getUsersFromUserRole(userRoleId:number){
    let exists = await prisma.userRole.findUnique({
        where: {
            id: userRoleId
        }
    })
    if(!exists) throw new Error("No se encontró el rol de usuario.")

    const users = await prisma.user.findMany({
        where: {
            userRoleId: userRoleId
        }
    })

    return users
}

export async function doesUserWithCodeExist(code:string){
    const user = await prisma.user.findFirst({
        where: {
            code: code,
            pendingPasswordSetup: true
        }
    })

    return user ? true : false
}

export async function activateAccount(password:string,code:string){
    const user = await prisma.user.findFirst({
        where: {
            code: code
        }
    })
    if(!user) throw new Error("Error del servidor.")

    const hashed = await bcrypt.hash(password,12)

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            passwordHash: hashed,
            active: true,
            pendingPasswordSetup: false
        }
    })
}