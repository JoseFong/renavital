import { getAllProducts } from "@/controllers/productsController";
import { NextResponse } from "next/server";

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