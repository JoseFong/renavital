import { getAllAnesthesias } from "@/controllers/anesthesiaController";
import { getAllConfigurations } from "@/controllers/configurationController";
import { assignConfigurationsToMedicalProcedure, getMedicalProcedureById } from "@/controllers/medicalProcedureController";
import { getAllProcedures } from "@/controllers/procedureController";
import { getAllStays } from "@/controllers/stayController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const medicalProcedure = await getMedicalProcedureById(idNum)
        const configurations = await getAllConfigurations()
        const procedures = await getAllProcedures()
        const anesthesias = await getAllAnesthesias()
        const stays = await getAllStays()

        return NextResponse.json({medicalProcedure,configurations,procedures,anesthesias,stays})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const configurationIds = data.configurationIds

        await assignConfigurationsToMedicalProcedure(idNum,configurationIds)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}