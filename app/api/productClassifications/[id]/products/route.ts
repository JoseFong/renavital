import { assignProductsToClassification, getProductsForClassification } from "@/controllers/productClassificationController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest,{params}:{params:Promise<{id:string}>}) {
    try {
        const {id} = await params
        const idNum = Number(id)

        const products = await getProductsForClassification(idNum)

        return NextResponse.json(products)
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest,{params}:{params:Promise<{id:string}>}) {
    try {
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        const productIds = data.productIds

        await assignProductsToClassification(idNum,productIds)

        return NextResponse.json({status:200})
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}