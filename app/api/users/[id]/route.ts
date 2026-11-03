import { getUserById, updateUser, updateUserStatus } from "@/controllers/userController"
import { getUserSession } from "@/middleware/session"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUserSession()
        if (!session?.role.permissions.includes("User.Read")) throw new Error("No está autorizado.")

        const { id } = await params
        const idNum = Number(id)

        const user = await getUserById(idNum)

        return NextResponse.json(user)
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUserSession()
        if(!session?.role.permissions.includes("User.Update")) throw new Error("No está autorizado.")

        const { id } = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateUser(idNum, data)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUserSession()
        if(!session?.role.permissions.includes("User.Update")) throw new Error("No está autorizado.")

        const { id } = await params
        const idNum = Number(id)

        await updateUserStatus(idNum)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}