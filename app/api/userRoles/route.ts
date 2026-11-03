import { createUserRole, getAllUserRoles } from "@/controllers/userRoleController";
import { getUserSession } from "@/middleware/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const session = await getUserSession()
        if(!session || !session.role.permissions.includes("UserRole.Read")) throw new Error("No está autorizado.")

        const userRoles = await getAllUserRoles()

        return NextResponse.json(userRoles)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{
        const session = await getUserSession()
        if(!session || !session.role.permissions.includes("UserRole.Create")) throw new Error("No está autorizado.")

        const data = await req.json()
        
        await createUserRole(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}