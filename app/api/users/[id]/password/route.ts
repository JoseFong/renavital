import { updateUserPassword } from "@/controllers/userController"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const password = data.password

        await updateUserPassword(idNum,password)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}