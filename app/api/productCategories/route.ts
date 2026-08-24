import { getAllProductCategories } from "@/controllers/productCategoriesController"
import { NextResponse } from "next/server"

export async function GET(){
    try{
        const data = await getAllProductCategories()

        return NextResponse.json(data)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}