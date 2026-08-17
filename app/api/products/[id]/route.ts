import { deleteProduct, getProductFromId, updateProduct, updateProductStatus } from "@/controllers/productsController";
import { NextRequest, NextResponse } from "next/server";

/**
 * HANDLER para eliminar productos
 * @param param1 id del producto a eliminar 
 * @returns respuesta del servidor
 */
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await deleteProduct(idNum)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * handler para consultar información de un producto
 * @param param1 id del producto 
 * @returns producto encontrado
 */
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const product = await getProductFromId(idNum)
        return NextResponse.json(product)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para actualizar información de un producto
 * @param req datos nuevos del producto
 * @param param1 id del producto a actualizar
 * @returns respuesta del servidor
 */
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        const data = await req.json()

        await updateProduct(idNum,data)
        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * Handler para cambiar el estado de un producto
 * @param param1 id del producto a cambiar su estado
 * @returns respuesta del servidor
 */
export async function PUT(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const {id} = await params
        const idNum = Number(id)

        await updateProductStatus(idNum)

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}
