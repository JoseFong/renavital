import { getAllUsers } from "@/controllers/userController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest){
    try{
        const users = await getAllUsers()

        return NextResponse.json(users)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}