import { getQuoteFromId } from "@/controllers/quoteController";
import { getUserSession } from "@/middleware/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const userSession = await getUserSession()
        if(!userSession || !userSession.role.permissions.includes("Quote.ReadOwn")) throw new Error("No está autorizado.")

        const {id} = await params
        const idNum = Number(id)

        const quote = await getQuoteFromId(idNum)
        if(!quote) throw new Error("No se encontró la cotización")

        if(quote.doctorId !== userSession.doctorId) throw new Error("No se encontró la cotización") 
        
        return NextResponse.json(quote)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}