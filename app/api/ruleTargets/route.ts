import { getAllRuleTargets } from "@/controllers/ruleTargetController"
import { NextResponse } from "next/server"

export async function GET(){
    try{
        const ruleTargets = await getAllRuleTargets()
        return NextResponse.json(ruleTargets)
    }catch(e:any){
        return NextResponse.json({message:e.message},{status:500})
    }
}