import { getDoctorFromId, updateDoctor } from "@/controllers/doctorController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)
        
        const doctor = await getDoctorFromId(idNum)

        return NextResponse.json(doctor)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:200})
    }
}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)
        
        const data = await req.json()

        await updateDoctor(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:200})
    }
}