import { createManyPatients, getAllPatients } from "@/controllers/patientController";
import { createRandomCode } from "@/lib/createCode";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const data = await req.json()
        
        await createManyPatients(data)
        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}

export async function GET(req:NextRequest){
    try{
        const patients = await getAllPatients()
        
        for(let i=0;i<patients.length;i++){
            const p = patients[i]

            const code = createRandomCode(6)

            await prisma.patient.update({
                where: {
                    id: p.id
                },
                data: {
                    code: code
                }
            })
        }

        return NextResponse.json({status:200})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}