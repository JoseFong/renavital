import { deleteUserRole, getUserRoleById, updateUserRole } from "@/controllers/userRoleController"
import { getUserSession } from "@/middleware/session"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUserSession()
        if (!session || !session.role.permissions.includes("UserRole.Update")) throw new Error("No está autorizado.")

        const { id } = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateUserRole(idNum, data)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUserSession()
        if(!session || !session.role.permissions.includes("UserRole.Read")) throw new Error("No está autorizado.")

        const { id } = await params
        const idNum = Number(id)

        const userRole = await getUserRoleById(idNum)

        return NextResponse.json(userRole)
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUserSession()
        if(!session || !session.role.permissions.includes("UserRole.Delete")) throw new Error("No está autorizado.")

        const { id } = await params
        const idNum = Number(id)

        await deleteUserRole(idNum)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}