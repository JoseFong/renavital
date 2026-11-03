import { activateAccount } from "@/controllers/userController"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        const code = data.code
        const password = data.password

        await activateAccount(password,code)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}