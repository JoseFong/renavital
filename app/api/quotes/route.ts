import { createQuote } from "@/controllers/quoteController";
import { getUserSession } from "@/middleware/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const userSession = await getUserSession()
        if (!userSession || !userSession.role.permissions.includes("Quote.Create")) throw new Error("No está autorizado.")


        const data = await req.json()

        await createQuote(data)

        return NextResponse.json({status:200})
    } catch (e: any) {
        console.log(e.message)
        return NextResponse.json({ message: e.message }, { status: 500 })
    }
}