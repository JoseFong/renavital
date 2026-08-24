import { deleteManyProducts } from "@/controllers/productsController"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        const ids = data.selectedIds
        await deleteManyProducts(ids)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}