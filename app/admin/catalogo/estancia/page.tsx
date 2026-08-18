"use client"
import { Stay } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import CreateStay from "@/components/catalogue/Stays/CreateStay"
import DeleteStay from "@/components/catalogue/Stays/DeleteStay"
import UpdateStay from "@/components/catalogue/Stays/UpdateStay"
import UpdateStayStatus from "@/components/catalogue/Stays/UpdateStayStatus"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const loaded = useRef(false)

  const [loading, setLoading] = useState(false)
  const [stays, setStays] = useState<Stay[]>([])

  const [selectedStay, setSelectedStay] = useState<Stay | null>(null)

  const [isCreateStayOpen, setIsCreateStayOpen] = useState(false)
  const [isUpdateStayOpen, setIsUpdateStayOpen] = useState(false)
  const [isDeleteStayOpen,setIsDeleteStayOpen] = useState(false)
  const [isUpdateStayStatusOpen,setIsUpdateStayStatusOpen] = useState(false)

  async function fetchStays() {
    try {
      setLoading(true)

      const response = await axios.get("/api/stays")
      setStays(response.data)

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

  useEffect(() => {
    if(loaded.current===false)
      fetchStays()
    loaded.current=true
  }, [])

  return (
    <div>
      <NavBarCatalogue selected="Estancia" />
      <div className="p-5 flex flex-col gap-1">
        <h1 className="font-bold">Tipos de estancias</h1>
        <button onClick={() => setIsCreateStayOpen(true)} className="underline cursor-pointer">Registrar</button>
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
            {stays.map((s: Stay) => (
              <tr key={s.id}>
                <td className="border-2 p-1">{s.id}</td>
                <td className="border-2 p-1">{s.code}</td>
                <td className="border-2 p-1">{s.name}</td>
                <td className="border-2 p-1">
                  <button onClick={()=>{setSelectedStay(s); setIsUpdateStayStatusOpen(true)}} className="underline cursor-pointer">
                    {s.active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="border-2 p-1">
                  <button onClick={()=>{setSelectedStay(s); setIsUpdateStayOpen(true)}} className="underline cursor-pointer">Editar</button>
                  <button onClick={()=>{setSelectedStay(s); setIsDeleteStayOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateStay open={isCreateStayOpen} setOpen={setIsCreateStayOpen} reload={fetchStays} />
      {selectedStay && <>
        <UpdateStay open={isUpdateStayOpen} setOpen={setIsUpdateStayOpen} stay={selectedStay} reload={fetchStays}/>
        <DeleteStay open={isDeleteStayOpen} setOpen={setIsDeleteStayOpen} stay={selectedStay} reload={fetchStays}/>
        <UpdateStayStatus open={isUpdateStayStatusOpen} setOpen={setIsUpdateStayStatusOpen} stay={selectedStay} reload={fetchStays}/>
      </>}
    </div>
  )
}

export default page