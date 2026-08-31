import { createAnesthesia, getActiveAnesthesias, getAllAnesthesias } from "@/controllers/anesthesiaController"
import { NextRequest, NextResponse } from "next/server"

/**
 * handler para consultar tipos de anestesias
 * @returns todos los tipos de anestesia
 */
export async function GET(req: NextRequest){
    try{
        const active = req.nextUrl.searchParams.get("active")

        if(active==="true"){
            const anesthesias = await getActiveAnesthesias()
            return NextResponse.json(anesthesias)
        }

        const anesthesias = await getAllAnesthesias()
        return NextResponse.json(anesthesias)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para crear un tipo de anestesia
 * @param req datos del nuevo tipo de anestesia
 * @returns respuesta del servidor
 */
export async function POST(req:NextRequest){
    try{
        const data = await req.json()
        await createAnesthesia(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}