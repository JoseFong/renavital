import { getProductsWithCategory } from "@/controllers/productsController"
import { NextResponse } from "next/server"

export async function GET(){
    try{
        const products = await getProductsWithCategory()
        return NextResponse.json(products)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}
