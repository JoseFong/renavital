import { getDoctorFromId } from "@/controllers/doctorController";
import { getMedicalProceduresFromManySpecialties } from "@/controllers/medicalProcedureController";
import { getAllPatients } from "@/controllers/patientController";
import { getSpecialtyById } from "@/controllers/specialtiesController";
import { getUserSession } from "@/middleware/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:Promise<{doctorId:string}>}){
    try{
        const session = await getUserSession()
        if(!session) throw new Error("No está autorizado.")
        if(!session.role.permissions.includes("Quote.Create")) throw new Error("No está autorizado.")

        const {doctorId} = await params
        const doctorIdNum = Number(doctorId)

        const doctor = await getDoctorFromId(doctorIdNum)
        if(!doctor) throw new Error("No se encontró el médico.")

        const specialtyIds = doctor.doctorSpecialties.map((ds)=>ds.specialtyId)

        let medicalProcedures = await getMedicalProceduresFromManySpecialties(specialtyIds)
    
        let patients = await getAllPatients()

        return NextResponse.json({doctor,medicalProcedures,patients})
    }catch(e:any){
        console.log(e.message)
        return NextResponse.json({message:e.message},{status:500})
    }
}