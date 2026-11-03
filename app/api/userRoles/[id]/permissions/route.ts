import { updateUserRolePermissions } from "@/controllers/userRoleController"
import { getUserSession } from "@/middleware/session"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getUserSession()
        if (!session || !session.role.permissions.includes("UserRole.Update")) throw new Error("No está autorizado.")

        const { id } = await params
        const idNum = Number(id)

        const data = await req.json()
        const permissions = data.permissions

        await updateUserRolePermissions(idNum, permissions)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}