"use client"
import { Patient } from "@/app/generated/prisma/client"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import { formatDate } from "@/lib/formatDate"
import { normalizeText } from "@/lib/normalizeText"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const loaded = useRef(false)

  const router = useRouter()

  const [patients, setPatients] = useState<Patient[]>([])
  const [search,setSearch] = useState("")

  async function fetchPatients() {
    try {
      const response = await axios.get("/api/patients")
      setPatients(response.data)
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message)
      } else {
        toast.error(e.message)
      }
    }
  }

  useEffect(()=>{
    if(loaded.current) return
    fetchPatients()
    loaded.current=true
  },[])

  let patientResults = patients
  if(search.trim()===""){
    patientResults = [...patients]
  }else{
    let s = search.trim().toUpperCase()
    patientResults = patients.filter((p)=>{
      return (
        normalizeText(p.firstName+" "+p.lastName+" "+p.secondLastName).includes(s) ||
        p.curp?.toUpperCase().includes(s) ||
        p.phone.toUpperCase().includes(s)
      )
    })
  }

  function goToPatientPage(id:number){
    router.push("/admin/personas/pacientes/"+id)
  }

  return (
    <>
      <NavBarPersons selected="pacientes" />
      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold text-xl">Pacientes</h1>
        <button onClick={()=>router.push("/admin/personas/pacientes/nuevo")} className="underline cursor-pointer">Registrar nuevo</button>
        <input placeholder="Buscar por nombre, CURP o teléfono..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <div className="grid grid-cols-5 bg-zinc-100 border rounded-md p-2 text-lg">
            <h2 className="font-bold">Nombre</h2>
            <h2 className="font-bold">Teléfono</h2>
            <h2 className="font-bold">Fecha de nacimiento</h2>
            <h2 className="font-bold">CURP</h2>
            <h2 className="font-bold">Acciones</h2>
          </div>
        <div className="flex flex-col text-lg">
          {patientResults.map((p,index)=>(
            <div
              key={p.id}
              className={`${index===0 && "rounded-t-lg"} ${index===patientResults.length-1 && "rounded-b-lg"} ${index%2===0 && "bg-zinc-100"} hover:bg-zinc-200 cursor-pointer border grid grid-cols-5 p-2`}
              onClick={()=>goToPatientPage(p.id)}
            >
              <p>{p.firstName}{" "}{p.lastName}{" "}{p.secondLastName}</p>
              <p>{p.countryCode}{" "}{p.phone}</p>
              <p>{formatDate(p.birthday).toUpperCase()}</p>
              <p>{p.curp ?? "-"}</p>
              <button className="underline cursor-pointer text-start">Ver más</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default page