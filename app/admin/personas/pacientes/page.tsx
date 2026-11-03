"use client"
import { Patient } from "@/app/generated/prisma/client"
import CopyQuoteLink from "@/components/persons/patients/CopyQuoteLink"
import TogglePatientCanQuote from "@/components/persons/patients/TogglePatientCanQuote"
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
  const [search, setSearch] = useState("")

  const [isToggleCanQuoteOpen, setIsToggleCanQuoteOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient>()
  const [isCopyLinkOpen, setIsCopyLinkOpen] = useState(false)

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

  useEffect(() => {
    if (loaded.current) return
    fetchPatients()
    loaded.current = true
  }, [])

  let patientResults = patients
  if (search.trim() === "") {
    patientResults = [...patients]
  } else {
    let s = search.trim().toUpperCase()
    patientResults = patients.filter((p) => {
      return (
        normalizeText(p.firstName + " " + p.lastName + " " + p.secondLastName).includes(s) ||
        p.curp?.toUpperCase().includes(s) ||
        p.phone.toUpperCase().includes(s)
      )
    })
  }

  function goToPatientPage(id: number) {
    router.push("/admin/personas/pacientes/" + id)
  }

  return (
    <>
      <NavBarPersons selected="pacientes" />
      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold text-xl">Pacientes</h1>
        <button onClick={() => router.push("/admin/personas/pacientes/nuevo")} className="underline cursor-pointer">Registrar nuevo</button>
        <input placeholder="Buscar por nombre, CURP o teléfono..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <table>
          <thead>
            <tr>
              <th className="border p-1">Nombre</th>
              <th className="border p-1">Teléfono</th>
              <th className="border p-1">CURP</th>
              <th className="border p-1">Fecha de nacimiento</th>
              <th className="border p-1">¿Puede realizar una cotización?</th>
              <th className="border p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {patientResults.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((p) => (
              <tr key={p.id}>
                <td className="border p-1">
                  {p.firstName}{" "}{p.lastName}{" "}{p.secondLastName ?? ""}
                </td>
                <td className="border p-1">
                  {p.countryCode}{" "}{p.phone}
                </td>
                <td className="border p-1">
                  {p.curp ?? "-"}
                </td>
                <td className="border p-1">
                  {formatDate(p.birthday)}
                </td>
                <td className="border p-1">
                  <button onClick={() => { setSelectedPatient(p); setIsToggleCanQuoteOpen(true) }} className="underline cursor-pointer">
                    {p.canQuote ? "Permitido" : "No permitido"}
                  </button>
                  {" "}
                  {p.canQuote &&
                    <button onClick={()=>{setSelectedPatient(p); setIsCopyLinkOpen(true)}} className="underline cursor-pointer">Copiar link para cotización</button>
                  }
                </td>
                <td className="border p-1">
                  <button onClick={() => router.push("/admin/personas/pacientes/" + p.id)} className="underline cursor-pointer">Ver más</button>
                  <button onClick={() => router.push("/admin/personas/pacientes/" + p.id + "/editar")} className="underline cursor-pointer">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPatient &&
        <>
          <TogglePatientCanQuote open={isToggleCanQuoteOpen} setOpen={setIsToggleCanQuoteOpen} patient={selectedPatient} reload={fetchPatients} />
          <CopyQuoteLink open={isCopyLinkOpen} setOpen={setIsCopyLinkOpen} code={selectedPatient.code}  />
        </>
      }
    </>
  )
}

export default page