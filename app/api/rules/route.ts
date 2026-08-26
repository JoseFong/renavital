import { createRule, getAllRules } from "@/controllers/ruleController"
import { NextRequest, NextResponse } from "next/server"

export async function GET(){
    try{
        const rules = await getAllRules()

        return NextResponse.json(rules)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function POST(req:NextRequest){
    try{
        const data = await req.json()

        await createRule(data)

        return NextResponse.json({status:200})
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}