import { getAllAnesthesias } from "@/controllers/anesthesiaController";
import { getAllConfigurations } from "@/controllers/configurationController";
import { getAllProcedures } from "@/controllers/procedureController";
import { getAllStays } from "@/controllers/stayController";
import { NextResponse } from "next/server";

export async function GET(){
    try{
        const configurations = await getAllConfigurations()
        const procedures = await getAllProcedures()
        const anesthesias = await getAllAnesthesias()
        const stays = await getAllStays()

        return NextResponse.json({configurations,procedures,anesthesias,stays})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}