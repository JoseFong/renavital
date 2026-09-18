import { deleteSpecialty, getSpecialtyById, updateSpecialty } from "@/controllers/specialtiesController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const specialty = await getSpecialtyById(idNum)

        return NextResponse.json(specialty)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateSpecialty(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await deleteSpecialty(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}