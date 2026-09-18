import { assignDoctorsToSpecialty, getDoctorsWithSpecialty } from "@/controllers/specialtiesController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const doctors = await getDoctorsWithSpecialty(idNum)

        return NextResponse.json(doctors)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()
        const doctorIds = data.doctorIds

        await assignDoctorsToSpecialty(idNum,doctorIds)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}