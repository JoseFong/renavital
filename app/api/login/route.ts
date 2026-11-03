import { login, logout } from "@/controllers/sessionController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await login(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function GET(){
    try{
        await logout()

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}