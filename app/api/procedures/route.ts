import { createProcedure, getActiveProcedures, getAllProcedures } from "@/controllers/procedureController"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handler para consultar todos los procedimientos
 * @returns todos los procedimientos
 */
export async function GET(req:NextRequest) {
    try {
        const active = req.nextUrl.searchParams.get("active")

        if (active === "true") {
            const procedures = await getActiveProcedures()
            return NextResponse.json(procedures)
        }

        const procedures = await getAllProcedures()
        return NextResponse.json(procedures)
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

/**
 * Handler para crear un nuevo tipo de procedimiento
 * @param req datos del nuevo tipo de procedimiento
 * @returns respuesta del servidor
 */
export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        await createProcedure(data)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}