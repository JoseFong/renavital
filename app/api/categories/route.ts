import { createCategory, getAllCategories } from "@/controllers/categoriesController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handler GET categorias
 * @returns arreglo de todas las categorias
 */
export async function GET(){
    try{
        const categories = await getAllCategories()
        return NextResponse.json(categories)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler POST para creación de categorías
 * @param req peticion API con datos de la categoria a registrar (nombre)
 * @returns respuesta del servidor (fallo/exito)
 */
export async function POST(req: NextRequest){
    try{
        const data = await req.json()
        await createCategory(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}