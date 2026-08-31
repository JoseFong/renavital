import { getFullInfoFromActiveConfiguration, getFullInfoFromConfiguration } from "@/controllers/configurationController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{id:number}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const active = req.nextUrl.searchParams.get("active")
        if(active==="true"){
            const info = await getFullInfoFromActiveConfiguration(idNum)
            return NextResponse.json(info)
        }

        const info = await getFullInfoFromConfiguration(idNum)

        return NextResponse.json(info)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}