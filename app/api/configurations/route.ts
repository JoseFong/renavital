import { createConfiguration, getAllConfigurations } from "@/controllers/configurationController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(){
    try{
        const configurations = await getAllConfigurations()
        return NextResponse.json(configurations)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createConfiguration(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}