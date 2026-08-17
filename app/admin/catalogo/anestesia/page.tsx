"use client"
import { Anesthesia } from "@/app/generated/prisma/client"
import CreateAnesthesia from "@/components/catalogue/Anesthesia/CreateAnesthesia"
import DeleteAnesthesia from "@/components/catalogue/Anesthesia/DeleteAnesthesia"
import UpdateAnesthesia from "@/components/catalogue/Anesthesia/UpdateAnesthesia"
import UpdateAnesthesiaStatus from "@/components/catalogue/Anesthesia/UpdateAnesthesiaStatus"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const [loading, setLoading] = useState(false)
  const [anesthesias, setAnesthesias] = useState<Anesthesia[]>([])

  const [selectedAnesthesia,setSelectedAnesthesia] = useState<Anesthesia|null>(null)

  const [isUpdateAnesthesiaStatusOpen,setIsUpdateAnesthesiaStatusOpen] = useState(false)
  const [isCreateAnesthesiaOpen,setIsCreateAnesthesiaOpen] = useState(false)
  const [isDeleteAnesthesiaOpen,setIsDeleteAnesthesiaOpen] = useState(false)
  const [isUpdateAnesthesiaOpen,setIsUpdateAnesthesiaOpen] = useState(false)

  async function fetchAnesthesias() {
    try {
      setLoading(true)
      const response = await axios.get("/api/anesthesias")
      setAnesthesias(response.data)
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
    fetchAnesthesias()
  },[])

  return (
    <div>
      <NavBarCatalogue selected="Anestesia" />
      <div className="flex flex-col gap-1 p-5">
        <h1 className="font-bold">Anestesias</h1>
        <button onClick={()=>setIsCreateAnesthesiaOpen(true)} className="underline cursor-pointer">Registrar</button>
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
            {anesthesias.map((a:Anesthesia)=>(
              <tr key={a.id}>
                <td className="border-2 p-1">{a.id}</td>
                <td className="border-2 p-1">{a.code}</td>
                <td className="border-2 p-1">{a.name}</td>
                <td className="border-2 p-1">
                  <button onClick={()=>{setSelectedAnesthesia(a); setIsUpdateAnesthesiaStatusOpen(true)}} className="underline cursor-pointer">
                    {a.active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="border-2 p-1">
                  <button onClick={()=>{setSelectedAnesthesia(a); setIsUpdateAnesthesiaOpen(true)}} className="underline cursor-pointer">Editar</button>
                  <button onClick={()=>{setSelectedAnesthesia(a); setIsDeleteAnesthesiaOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateAnesthesia open={isCreateAnesthesiaOpen} setOpen={setIsCreateAnesthesiaOpen} reload={fetchAnesthesias}/>
      {selectedAnesthesia && <>
        <UpdateAnesthesia open={isUpdateAnesthesiaOpen} an={selectedAnesthesia} setOpen={setIsUpdateAnesthesiaOpen} reload={fetchAnesthesias}/>
        <DeleteAnesthesia open={isDeleteAnesthesiaOpen} setOpen={setIsDeleteAnesthesiaOpen} an={selectedAnesthesia} reload={fetchAnesthesias}/>
        <UpdateAnesthesiaStatus open={isUpdateAnesthesiaStatusOpen} setOpen={setIsUpdateAnesthesiaStatusOpen} an={selectedAnesthesia} reload={fetchAnesthesias}/>
      </>}
    </div>
  )
}

export default page