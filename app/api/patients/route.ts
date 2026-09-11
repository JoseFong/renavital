import { createPatient, getAllPatients } from "@/controllers/patientController"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const patients = await getAllPatients()
        return NextResponse.json(patients)
    } catch (e: any) {
        console.log(e.message)
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        await createPatient(data)
        return NextResponse.json({status:200})
    } catch (e: any) {
        console.log(e.message)
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}