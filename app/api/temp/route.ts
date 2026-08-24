import { createManyProuctCategories } from "@/controllers/temp"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createManyProuctCategories(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}