"use client"
import { Doctor, Patient } from "@/app/generated/prisma/client"
import CodesNavBar from "@/components/codes/CodesNavBar"
import { normalizeText } from "@/lib/normalizeText"
import { CodeInfo } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const loaded = useRef(false)

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [code, setCode] = useState<CodeInfo>()
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [patients, setPatients] = useState<Patient[]>([])

    const [selectedDoctors, setSelectedDoctors] = useState<Number[]>([])
    const [selectedPatients, setSelectedPatients] = useState<Number[]>([])

    const [patientSearch,setPatientSearch] = useState("")
    const [doctorSearch,setDoctorSearch] = useState("")

    async function fetchCode() {
        try {
            const response = await axios.get("/api/codes/" + id)
            setCode(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchDoctors() {
        try {
            const response = await axios.get("/api/doctors")
            setDoctors(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchPatients() {
        try {
            const response = await axios.get("/api/patients")
            setPatients(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchCode()
        fetchDoctors()
        fetchPatients()
        loaded.current = true
    }, [])

    useEffect(() => {
        if (patients && doctors && code) {
            let aux
            aux = doctors.filter((d) => code?.codeUsages.some((cu) => cu.doctorId === d.id)).map((d) => d.id)
            setSelectedDoctors(aux)

            aux = patients.filter((p) => code?.codeUsages.some((cu) => cu.patientId === p.id)).map((p) => p.id)
            setSelectedPatients(aux)
        }
    }, [patients, doctors,code])

    if (!code) return

    let patientResults = [...patients]
    if(patientSearch.trim()!==""){
        let search = normalizeText(patientSearch)
        patientResults = patients.filter((p)=>{
            let fullName = normalizeText(p.firstName+" "+p.lastName+" "+p.secondLastName)
            return fullName.includes(search)
        })
    }

    let doctorResults = [...doctors]
    if(doctorSearch.trim()!==""){
        let search = normalizeText(doctorSearch)
        doctorResults = doctors.filter((d)=>{
            let fullName = normalizeText(d.firstName+" "+d.lastName+" "+d.secondLastName)
            return fullName.includes(search)
        })
    }

    function toggleDoctor(id:number){
        if(selectedDoctors.includes(id)){
            let aux = selectedDoctors.filter((sd)=>sd!==id)
            setSelectedDoctors(aux)
        }else{
            let aux = [...selectedDoctors]
            aux.push(id)
            setSelectedDoctors(aux)
        }
    }

    function togglePatient(id:number){
        if(selectedPatients.includes(id)){
            let aux = selectedPatients.filter((sd)=>sd!==id)
            setSelectedPatients(aux)
        }else{
            let aux = [...selectedPatients]
            aux.push(id)
            setSelectedPatients(aux)
        }
    }

    async function fetchUpdate(){
        try{
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            const data = {
                patientIds: selectedPatients,
                doctorIds: selectedDoctors
            }

            await axios.post("/api/codes/"+id+"/people",data)

            toast.success("Personas asignadas a código de descuento exitosamente.",{id:"1"})
            router.push("/admin/codigos/"+id)
            setLoading(false)
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <>
            <CodesNavBar selected="codigos" />
            <div className="flex flex-col gap-1 p-5">
                <button onClick={() => router.push("/admin/codigos/" + id)} className="underline cursor-pointer">Regresar</button>
                <h1 className="font-bold text-lg">Personas que pueden usar el código '{code.code}'</h1>
                <button disabled={loading} onClick={fetchUpdate} className="underline cursor-pointer disabled:cursor-not-allowed">Guardar cambios</button>
                <div className="flex flex-row gap-10">
                    <div className="border p-2">
                        <h1 className="font-bold">Pacientes</h1>
                        <input placeholder="Buscar pacientes" value={patientSearch} onChange={(e)=>setPatientSearch(e.target.value)}/>
                        {patientResults.map((p)=>(
                            <div key={p.id} className="flex flex-row gap-1">
                                <input type="checkbox" checked={selectedPatients.includes(p.id)} onChange={()=>togglePatient(p.id)}/>
                                <p>{p.firstName}{" "}{p.lastName}{" "}{p.secondLastName}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border p-2">
                        <h1 className="font-bold">Médicos</h1>
                        <input placeholder="Buscar pacientes" value={doctorSearch} onChange={(e)=>setDoctorSearch(e.target.value)}/>
                        {doctorResults.map((d)=>(
                            <div key={d.id} className="flex flex-row gap-1">
                                <input type="checkbox" checked={selectedDoctors.includes(d.id)} onChange={()=>toggleDoctor(d.id)}/>
                                <p>{d.firstName}{" "}{d.lastName}{" "}{d.secondLastName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default page