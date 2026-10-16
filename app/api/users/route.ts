import { createUser, getAllUsers } from "@/controllers/userController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){
    try{
        const users = await getAllUsers()

        return NextResponse.json(users)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createUser(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}