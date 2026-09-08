import { createProductClassification, getAllProductClassifications } from "@/controllers/productClassificationController"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const productClassifications = await getAllProductClassifications()

        return NextResponse.json(productClassifications)
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        await createProductClassification(data)

        return NextResponse.json({ status: 200 })
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}