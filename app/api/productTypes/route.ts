import { createProductType, getAllProductTypes } from "@/controllers/productTypeController"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handler para consultar todos los tipos de producto
 * @returns todos los tipos de producto
 */
export async function GET(){
    try{
        const productTypes = await getAllProductTypes()
        return NextResponse.json(productTypes)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para crear un nuevo tipo de producto
 * @param req datos del nuevo tipo de producto
 * @returns respuesta del servidor
 */
export async function POST(req:NextRequest){
    try{
        const data = await req.json()
        await createProductType(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}