import { unassignProductsFromCategory } from "@/controllers/categoriesController"
import { IdQuantity } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const productIds:number[] = data.productIds

        await unassignProductsFromCategory(idNum,productIds)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}