import { deleteStay, updateStay, updateStayStatus } from "@/controllers/stayController"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handler para eliminar un tipo de estancia
 * @param param1 id del tipo de estancia a eliminar
 * @returns respuesta del servidor
 */
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await deleteStay(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para actualizar información del servidor
 * @param req informacion a actualizar del tipo de estancia
 * @param param1 id del tipo de estancia a actualizar
 * @returns respuesta del servidor
 */
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateStay(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para actualizar el estado (activo/inactivo) de un tipo de estancia
 * @param param1 id del tipo de estancia a cambiar su estado 
 * @returns respuesta del servidor
 */
export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await updateStayStatus(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}