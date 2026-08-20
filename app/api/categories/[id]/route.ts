import { changeCategoryStatus, deleteCategory, getCategoryFromId, updateCategory } from "@/controllers/categoriesController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const category = await getCategoryFromId(idNum)

        return NextResponse.json(category)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para eliminar una categoria
 * @param param1 id de la categoria a eliminar
 * @returns respuesta del servidor (exito/fallo)
 */
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)
        await deleteCategory(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para cambiar el estado de una categoría
 * @param param1 id de la categoría a cambiar el estado 
 * @returns respuesta del servidor
 */
export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await changeCategoryStatus(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para actualizar/editar una categoría
 * @param req peticion api, contiene la nueva información de la categoría
 * @param param1 id de la categoría a modificar
 * @returns respuesta del servidor
 */
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateCategory(idNum,data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}