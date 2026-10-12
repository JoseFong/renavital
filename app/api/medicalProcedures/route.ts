import { createMedicalProcedure, getAllMedicalProcedures } from "@/controllers/medicalProcedureController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try{    
        const medicalProcedures = await getAllMedicalProcedures()

        return NextResponse.json(medicalProcedures)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{    
        const data = await req.json()

        await createMedicalProcedure(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}