import { createUserRole, getAllUserRoles } from "@/controllers/userRoleController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const userRoles = await getAllUserRoles()

        return NextResponse.json(userRoles)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{
        const data = await req.json()
        
        await createUserRole(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}