import { getCategoriesFromConfiguration } from "@/controllers/configurationController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const categories = await getCategoriesFromConfiguration(idNum)

        return NextResponse.json(categories)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}