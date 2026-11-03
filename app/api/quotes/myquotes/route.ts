import { getQuotesFromDoctor } from "@/controllers/quoteController"
import { getUserSession } from "@/middleware/session"
import { NextRequest, NextResponse } from "next/server"

export async function GET(){
    try {
        console.log("Entraste a myquotes")

        const userSession = await getUserSession()
        if (!userSession || !userSession.role.permissions.includes("Quote.ReadOwn")) throw new Error("No está autorizado.")
        if(!userSession.doctorId) throw new Error("No está autorizado.") 

        const quotes = await getQuotesFromDoctor(userSession.doctorId)

        return NextResponse.json(quotes)
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}