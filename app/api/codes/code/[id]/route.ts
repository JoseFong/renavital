import { getCodeReady } from "@/controllers/codeController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const data = await req.json()

        const type=data.type
        const personId = data.personId

        const code = await getCodeReady(id,personId,type)

        return NextResponse.json(code)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}