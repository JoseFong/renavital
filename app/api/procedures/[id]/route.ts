import { deleteProcedure, updateProcedure, updateProcedureStatus } from "@/controllers/procedureController"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handler para eliminar un tipo de procedimiento
 * @param param1 id del procedimiento a eliminar 
 * @returns respuesta del servidor
 */
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await deleteProcedure(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para cambiar estado de un tipo de procedimiento
 * @param param1 id del tipo de procedimiento a cambiar estado 
 * @returns respuesta del servidor
 */
export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await updateProcedureStatus(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para actualizar informacion de un tipo de procedimiento
 * @param req datos nuevos del procedimiento
 * @param param1 id del procedimiento a actualizar
 * @returns respuesta del servidor
 */
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateProcedure(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}