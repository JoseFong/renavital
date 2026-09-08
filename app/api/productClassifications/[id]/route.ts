import { deleteClassification, getProductClassificationFromId, updateClassification } from "@/controllers/productClassificationController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest,{params}:{params:Promise<{id:string}>}) {
    try {
        const {id} = await params
        const idNum = Number(id)
        
        const classification = await getProductClassificationFromId(idNum)

        return NextResponse.json(classification)
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest,{params}:{params:Promise<{id:string}>}) {
    try {
        const {id} = await params
        const idNum = Number(id)
        
        const data = await req.json()

        await updateClassification(idNum,data)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest,{params}:{params:Promise<{id:string}>}) {
    try {
        const {id} = await params
        const idNum = Number(id)

        await deleteClassification(idNum)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}