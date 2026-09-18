import { createSpecialty, getAllSpecialties, getAllSpecialtiesInfo, updateSpecialty } from "@/controllers/specialtiesController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{
        const specialties = await getAllSpecialtiesInfo()
        return NextResponse.json(specialties)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createSpecialty(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}