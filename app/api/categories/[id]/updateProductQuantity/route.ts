import { updateProductQuantity } from "@/controllers/categoriesController"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const idQuantities = data.idQuantities

        await updateProductQuantity(idNum,idQuantities)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}