import { changeCodeStatus, getCodeFromId, updateCode } from "@/controllers/codeController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const code = await getCodeFromId(idNum)

        return NextResponse.json(code)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    } 
}

export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await changeCodeStatus(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    } 
}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateCode(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    } 
}