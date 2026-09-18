import { createDoctor, getAllDoctors } from "@/controllers/doctorController";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createDoctor(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:200})
    }
}

export async function GET(req:NextRequest){
    try{
        const doctors = await getAllDoctors()

        return NextResponse.json(doctors)
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:200})
    }
}