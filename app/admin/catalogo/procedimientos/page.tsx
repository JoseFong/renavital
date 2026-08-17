"use client"
import { Procedure } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import CreateProcedure from "@/components/catalogue/Procedure/CreateProcedure"
import DeleteProcedure from "@/components/catalogue/Procedure/DeleteProcedure"
import UpdateProcedure from "@/components/catalogue/Procedure/UpdateProcedure"
import UpdateProcedureStatus from "@/components/catalogue/Procedure/UpdateProcedureStatus"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const loaded = useRef(false)
  const [loading,setLoading] = useState(false)
  const [procedures, setProcedures] = useState<Procedure[]>([])

  const [selectedProcedure,setSelectedProcedure] = useState<Procedure|null>(null)

  const [isCreateProcedureOpen,setIsCreateProcedureOpen] = useState(false)
  const [isUpdateProcedureOpen,setIsUpdateProcedureOpen] = useState(false)
  const [isDeleteProcedureOpen,setIsDeleteProcedureOpen] = useState(false)
  const [isUpdateStatusOpen,setIsUpdateStatusOpen] = useState(false)

  async function fetchProcedures() {
    try {
      setLoading(true)

      const response = await axios.get("/api/procedures")
      setProcedures(response.data)

      setLoading(false)
    } catch (e: any) {
      setLoading(false)
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message)
      } else {
        toast.error(e.message)
      }
    }
  }

  useEffect(()=>{
    if(loaded.current===false)
      fetchProcedures()
    loaded.current=true
  },[])

  return (
    <div>
      <NavBarCatalogue selected="Procedimientos" />
      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold">Procedimientos</h1>
        <button onClick={()=>setIsCreateProcedureOpen(true)} className="underline cursor-pointer">Registrar</button>
        <table>
          <thead>
            <tr>
              <th className="border-2 p-1">Id</th>
              <th className="border-2 p-1">Código</th>
              <th className="border-2 p-1">Nombre</th>
              <th className="border-2 p-1">Estado</th>
              <th className="border-2 p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
              {procedures.map((p:Procedure)=>(
                <tr key={p.id}>
                  <td className="border-2 p-1">{p.id}</td>
                  <td className="border-2 p-1">{p.code}</td>
                  <td className="border-2 p-1">{p.name}</td>
                  <td className="border-2 p-1">
                    <button onClick={()=>{setSelectedProcedure(p); setIsUpdateStatusOpen(true)}} className="underline cursor-pointer">
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="border-2 p-1">
                    <button onClick={()=>{setSelectedProcedure(p); setIsUpdateProcedureOpen(true)}} className="underline cursor-pointer">Editar</button>
                    <button onClick={()=>{setSelectedProcedure(p); setIsDeleteProcedureOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <CreateProcedure open={isCreateProcedureOpen} setOpen={setIsCreateProcedureOpen} reload={fetchProcedures}/>
      {selectedProcedure && <>
        <UpdateProcedureStatus open={isUpdateStatusOpen} setOpen={setIsUpdateStatusOpen} procedure={selectedProcedure} reload={fetchProcedures}/>
        <UpdateProcedure open={isUpdateProcedureOpen} setOpen={setIsUpdateProcedureOpen} procedure={selectedProcedure} reload={fetchProcedures}/>
        <DeleteProcedure open={isDeleteProcedureOpen} setOpen={setIsDeleteProcedureOpen} procedure={selectedProcedure} reload={fetchProcedures}/>
      </>}
    </div>
  )
}

export default page