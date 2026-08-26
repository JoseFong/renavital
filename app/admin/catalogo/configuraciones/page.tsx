"use client"
import DeleteConfigurationModal from "@/components/catalogue/Configuration/DeleteConfigurationModal"
import UpdateStatusModal from "@/components/catalogue/Configuration/UpdateStatusModal"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ConfigurationInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {
  const router = useRouter()

  const [loading,setLoading] = useState(false)

  const [configurations, setConfigurations] = useState<ConfigurationInfo[]>([])

  const [selectedConfiguration,setSelectedConfiguration] = useState<ConfigurationInfo|null>(null)
  const [isUpdateStatusOpen,setIsUpdateStatusOpen] = useState(false)
  const [isDeleteOpen,setIsDeleteOpen] = useState(false)

  const [search,setSearch] = useState("")
  const [results,setResults] = useState<ConfigurationInfo[]>([])

  async function fetchConfigurations() {
    try {
      setLoading(true)

      const response = await axios.get("/api/configurations")
      setConfigurations(response.data)

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
    fetchConfigurations()
  },[])

  useEffect(()=>{
    if(search.trim()===""){
      setResults(configurations)
    }else{
      let aux = [...configurations]
      aux = aux.filter((a:ConfigurationInfo)=>a.code.includes(search.trim().toUpperCase()) || a.anesthesia.name.includes(search.trim().toUpperCase()) || a.procedure.name.includes(search.trim().toUpperCase()) || a.stay.name.includes(search.trim().toUpperCase()))
      setResults(aux)
    }
  },[search])

  useEffect(()=>{
    if(configurations)
        setResults(configurations)
  },[configurations])

  return (
    <div>
      <NavBarCatalogue selected="Configuraciones" />
      <div className="p-5 flex flex-col gap-1">
        <h1 className="font-bold">Configuraciones</h1> 
        <input placeholder="Búsqueda" value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <label>{results.length} resultados</label>
        <button onClick={()=>router.push("/admin/catalogo/configuraciones/nueva")} className="underline cursor-pointer">Registrar</button>
        <table>
          <thead>
            <tr>
              <th className="border-2 p-1">Id</th>
              <th className="border-2 p-1">Código</th>
              <th className="border-2 p-1">Procedimiento</th>
              <th className="border-2 p-1">Anestesia</th>
              <th className="border-2 p-1">Estancia</th>
              <th className="border-2 p-1">Estado</th>
              <th className="border-2 p-1">Detalles</th>
              <th className="border-2 p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.map((c:ConfigurationInfo)=>(
              <tr key={c.id}>
                <td className="border-2 p-1">{c.id}</td>
                <td className="border-2 p-1">{c.code}</td>
                <td className="border-2 p-1">{c.procedure.name}</td>
                <td className="border-2 p-1">{c.anesthesia.name}</td>
                <td className="border-2 p-1">{c.stay.name}</td>
                <td className="border-2 p-1">
                  <button onClick={()=>{setSelectedConfiguration(c); setIsUpdateStatusOpen(true)}} className="underline cursor-pointer">
                    {c.active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="border-2 p-1">
                  <button onClick={()=>router.push("/admin/catalogo/configuraciones/"+c.id)} className="underline cursor-pointer">Ver detalles</button>
                </td>
                <td className="border-2 p-1">
                  <button onClick={()=>{setSelectedConfiguration(c); setIsDeleteOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedConfiguration && <>
        <UpdateStatusModal open={isUpdateStatusOpen} setOpen={setIsUpdateStatusOpen} reload={fetchConfigurations} configuration={selectedConfiguration}/>
        <DeleteConfigurationModal open={isDeleteOpen} setOpen={setIsDeleteOpen} reload={fetchConfigurations} configuration={selectedConfiguration}/>
      </>}
    </div>
  )
}

export default page