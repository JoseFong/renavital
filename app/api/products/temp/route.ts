import { unassignAllProductTypes } from "@/controllers/productsController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){
    try{
        await unassignAllProductTypes()
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}