import { createCode, getAllCodes } from "@/controllers/codeController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const codes = await getAllCodes()
        return NextResponse.json(codes)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    } 
}

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createCode(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    } 
}