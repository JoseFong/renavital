import { createUser, getAllUsers } from "@/controllers/userController"
import { getUserSession } from "@/middleware/session"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){
    try{
        const session = await getUserSession()

        console.log(session)

        if(!session?.role.permissions.includes("User.Read")) throw new Error("No está autorizado.")

        const users = await getAllUsers()

        return NextResponse.json(users)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{
        const session = await getUserSession()
        if(!session?.role.permissions.includes("User.Create")) throw new Error("No está autorizado.")

        const data = await req.json()

        await createUser(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}