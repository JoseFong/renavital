import { assignProductTypeToProducts, getProductsForProductType } from "@/controllers/productTypeController"
import { NextRequest, NextResponse } from "next/server"

/**
 * handler para obtener productos asignados a un tipo de producto o sin tipo de grupo asignados
 * @param param1 id del tipo de producto 
 * @returns Productos asignados al tipo de producto o sin tipo de producto asignado
 */
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const products = await getProductsForProductType(idNum)

        return NextResponse.json(products)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}