import { createProduct, getAllProducts } from "@/controllers/productsController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handler GET productos
 * @returns arreglo de todas los productos
 */
export async function GET(){
    try{
        const products = await getAllProducts()
        return NextResponse.json(products)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * handler para crear un producto nuevo
 * @param req datos del producto nuevo
 * @returns respuesta del servidor
 */
export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createProduct(data)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}