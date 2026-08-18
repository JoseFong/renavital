import { createStay, getAllStays } from "@/controllers/stayController";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handler para consultar todos los tipos de estancias
 * @returns todos los tipos de estancias
 */
export async function GET(){
    try{
        const stays = await getAllStays()
        return NextResponse.json(stays)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para crear un nuevo tipo de estancia
 * @param req informacion del nuevo tipo de estancia
 * @returns respuesta del servidor
 */
export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createStay(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}