import { unassignProductsFromCategory } from "@/controllers/categoriesController"
import { IdQuantity } from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const productsIds:number[] = data

        await unassignProductsFromCategory(idNum,productsIds)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}