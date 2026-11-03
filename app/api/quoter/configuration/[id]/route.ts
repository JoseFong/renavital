import { getFullInfoFromActiveConfiguration } from "@/controllers/configurationController";
import { getUserSession } from "@/middleware/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
    try{
        const userSession = await getUserSession()
        if(!userSession || !userSession.role.permissions.includes("Quote.Create")) throw new Error("No está autorizado")

        const {id} = await params
        const idNum = Number(id)

        const configuration = await getFullInfoFromActiveConfiguration(idNum)

        return NextResponse.json({configuration})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}