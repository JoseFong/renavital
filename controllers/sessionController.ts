import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export async function login(data: any) {
    let user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    username: data.username
                },
                {
                    email: data.username
                }
            ]
        }
    })
    if (!user) {
        throw new Error("Credenciales incorrectas.")
    }

    if (!user.active || user.pendingPasswordSetup) {
        throw new Error("Credenciales incorrectas.")
    }

    if (!user.userRoleId) throw new Error("Credenciales incorrectas.")

    const valid = await bcrypt.compare(data.password, user.passwordHash)

    if (!valid) {
        throw new Error("Credenciales incorrectas.")
    }

    const token: string = randomBytes(32).toString("base64url")

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    await prisma.session.create({
        data: {
            token: token,
            createdAt: now,
            expiresAt: expiresAt,
            userId: user.id,
            active: true
        }
    })

    const cookieStore = await cookies()
    cookieStore.set("sessionTokenRV", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt
    })
}

export async function logout(){
    const cookieStore = await cookies()
    const cookie = await cookieStore.get("sessionTokenRV")
    if(!cookie) return
    const token = cookie.value

    const session = await prisma.session.findFirst({
        where: {
            token: token
        }
    })

    if(session){
        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                active: false
            }
        })
    }

    await cookieStore.delete("sessionTokenRV")
}

export async function getSessionByToken(token: string) {
    return await prisma.session.findFirst({
        where: {
            token: token,
            active: true
        },
        include: {
            user: {
                include: {
                    userRole: true
                }
            }
        }
    })
}

export async function deactivateSession(id:number){
    const session = await prisma.session.findUnique({
        where: {
            id: id
        }
    })
    if(!session) throw new Error("No se encontró la sesión.")
    
    await prisma.session.update({
        where: {
            id: id
        },
        data: {
            active: false
        }
    })
}
