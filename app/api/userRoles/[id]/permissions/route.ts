import { updateUserRolePermissions } from "@/controllers/userRoleController"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const permissions = data.permissions

        await updateUserRolePermissions(idNum,permissions)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}