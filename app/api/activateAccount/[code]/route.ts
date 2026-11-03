import { getUserByCodeForActivation } from "@/controllers/userController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{code:string}>}){
    try{
        const {code} = await params
        
        const user = await getUserByCodeForActivation(code)
        return NextResponse.json(user)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}