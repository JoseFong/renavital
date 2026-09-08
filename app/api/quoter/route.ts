import { getActiveAnesthesias } from "@/controllers/anesthesiaController"
import { getAllConfigurations } from "@/controllers/configurationController"
import { getActiveProcedures } from "@/controllers/procedureController"
import { getAllRules } from "@/controllers/ruleController"
import { getActiveStays } from "@/controllers/stayController"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const configurations = await getAllConfigurations()
        const procedures = await getActiveProcedures()
        const anesthesias = await getActiveAnesthesias()
        const stays = await getActiveStays()
        const rules = await getAllRules()

        return NextResponse.json({configurations,procedures,anesthesias,stays,rules})
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}