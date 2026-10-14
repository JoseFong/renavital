import { assignSpecialtyToMedicalProcedure } from "@/controllers/medicalProcedureController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const specialyIds = data.specialtyIds

        await assignSpecialtyToMedicalProcedure(idNum,specialyIds)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}