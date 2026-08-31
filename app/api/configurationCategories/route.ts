import { getAllConfigurationCategories } from "@/controllers/configurationCategoriesController"
import { NextResponse } from "next/server"

export async function GET(){
    try{
        const configurationCategories = await getAllConfigurationCategories()

        return NextResponse.json(configurationCategories)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}