import { deleteProductType, updateProductType, updateProductTypeStatus } from "@/controllers/productTypeController"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handler para eliminar un tipo de producto
 * @param param1 id del tipo de producto a eliminar 
 * @returns respuesta del servidor
 */
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await deleteProductType(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para actualizar información de un tipo de producto
 * @param req nuevos datos del tipo de producto
 * @param param1 id del producto a actualizar
 * @returns respuesta del servidor
 */
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateProductType(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para actualizar el estado (activo/inactivo) de un producto
 * @param param1 id del tipo de producto a actualizar su estado 
 * @returns respuesta del servidor
 */
export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await updateProductTypeStatus(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}