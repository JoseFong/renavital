import { deleteAnestesia, updateAnesthesia, updateAnesthesiaStatus } from "@/controllers/anesthesiaController"
import { NextRequest, NextResponse } from "next/server"

/**
 * handler para eliminar un tipo de anestesia
 * @param param1 id del tipo de anestesia a eliminar
 * @returns respuesta del servidor
 */
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)
        await deleteAnestesia(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * handler para actualizar informacion de un tipo de anestesia
 * @param req datos nuevos del tipo de anestesia
 * @param param1 id de la anestesia a actualizar
 * @returns respuesta del servidor
 */
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateAnesthesia(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para cambiar estado de un tipo de anestesia
 * @param param1 id del tipo de anestesia a cambiar su estado 
 * @returns respuesta del servidor
 */
export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)
        await updateAnesthesiaStatus(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}