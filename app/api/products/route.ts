import { createProduct, deleteManyProducts, getActiveProducts, getAllProducts, getInactiveProducts } from "@/controllers/productsController";
import { getUserSession } from "@/middleware/session";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handler GET productos
 * @returns arreglo de todas los productos
 */
export async function GET(req:NextRequest){
    try{
        const userSession = await getUserSession()

        console.log(userSession)
        if(!userSession) return NextResponse.json({message:"No esta iniciado sesión."},{status:500})
        if(!userSession.role.permissions.includes("Product.Read")) return NextResponse.json({message:"No está autorizado."},{status:500})

        const active = req.nextUrl.searchParams.get("active")

        if(active==="true"){
            const products = await getActiveProducts()
            return NextResponse.json(products)
        }

        if(active==="false"){
            const products = await getInactiveProducts()
            return NextResponse.json(products)
        }

        const products = await getAllProducts()
        return NextResponse.json(products)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

/**
 * handler para crear un producto nuevo
 * @param req datos del producto nuevo
 * @returns respuesta del servidor
 */
export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createProduct(data)
        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

