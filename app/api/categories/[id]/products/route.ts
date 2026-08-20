import { getProductsForCategory } from "@/controllers/productsController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)
        
        const products = await getProductsForCategory(idNum)
        console.log(products)

        return NextResponse.json(products)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}
