"use client"
import UpdateMedicalProcedure from "@/components/catalogue/MedicalProcedures/UpdateMedicalProcedure"
import UpdateStatus from "@/components/catalogue/MedicalProcedures/UpdateStatus"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { medicalProcedureInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const router = useRouter()

  const loaded = useRef(false)

  const [medicalProcedures, setMedicalProcedures] = useState<medicalProcedureInfo[]>([])

  const [selectedMedicalProcedure, setSelectedMedicalProcedure] = useState<any>()
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)

  async function fetchMedicalProcedures() {
    try {
      const response = await axios.get("/api/medicalProcedures")
      setMedicalProcedures(response.data)
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? e.message)
    }
  }

  useEffect(() => {
    if (loaded.current) return
    fetchMedicalProcedures()
    loaded.current = true
  }, [])

  return (
    <>
      <NavBarCatalogue selected="procedimientos" />
      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold text-lg">Procedimientos Médicos Específicos</h1>
        <button onClick={() => router.push("/admin/catalogo/procedimientos/nuevo")} className="underline cursor-pointer">Registrar procedimiento</button>
        <table>
          <thead>
            <tr>
              <th className="border p-1">Código</th>
              <th className="border p-1">Nombre</th>
              <th className="border p-1">Estado</th>
              <th className="border p-1">Configuraciones</th>
              <th className="border p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicalProcedures.sort((a,b)=>a.code.localeCompare(b.code)).map((mp) => (
              <tr key={mp.id}>
                <td className="border p-1">{mp.code}</td>
                <td className="border p-1">{mp.name}</td>
                <td className="border p-1">
                  <button onClick={()=>{setSelectedMedicalProcedure(mp); setIsStatusOpen(true)}} className="underline cursor-pointer">
                    {mp.active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="border p-1">
                  ({mp.medicalProcedureConfigurations.length}){" "}
                  <button onClick={()=>router.push("/admin/catalogo/procedimientos/"+mp.id+"/configuraciones")} className="underline cursor-pointer">Gestionar</button>
                </td>
                <td className="border p-1">
                  <button onClick={() => { setSelectedMedicalProcedure(mp); setIsUpdateOpen(true) }} className="underline cursor-pointer">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedMedicalProcedure &&
        <>
          <UpdateStatus open={isStatusOpen} setOpen={setIsStatusOpen} reload={fetchMedicalProcedures} medicalProcedure={selectedMedicalProcedure}/>
          <UpdateMedicalProcedure open={isUpdateOpen} setOpen={setIsUpdateOpen} reload={fetchMedicalProcedures} medicalProcedure={selectedMedicalProcedure} />
        </>
      }
    </>
  )
}

export default page