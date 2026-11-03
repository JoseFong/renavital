import { validateCode } from "@/controllers/codeController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        const code = await validateCode(data.code,data.type,data.personId)
        
        console.log(code)

        return NextResponse.json(code)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}