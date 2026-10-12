"use client"

import NavBarConfig from "@/components/configurationsCot/NavBarConfig"
import { ConfigurationInfo, medicalProcedureInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const router = useRouter()

    const [loading,setLoading] = useState(false)

    const [configuration,setConfiguration] = useState<ConfigurationInfo>()
    const [medicalProcedures,setMedicalProcedures] = useState<medicalProcedureInfo[]>([])
    
    const [selectedProcedures,setSelectedProcedures] = useState<number[]>([])

    async function fetchConfiguration(){
        try{
            const response = await axios.get("/api/configurations/"+id)
            setConfiguration(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchMedicalProcedures(){
        try{
            const response = await axios.get("/api/medicalProcedures")
            setMedicalProcedures(response.data)
        }catch(e:any){
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(()=>{
        fetchConfiguration()
        fetchMedicalProcedures()
    },[])

    useEffect(()=>{
        if(configuration){
            setSelectedProcedures(configuration.medicalProcedureConfigurations.map((mpc)=>mpc.medicalProcedureId))
        }
    },[configuration])

    if(!configuration) return null

    function toggleMedicalProcedure(id:number){
        let aux = [...selectedProcedures]

        if(aux.includes(id)){
            aux = aux.filter((a)=>a!==id)
        }else{
            aux.push(id)
        }

        setSelectedProcedures(aux)
    }

    async function fetchPost(){
        try{
            toast.loading("Cargando...",{id:"1"})
            setLoading(true)

            const data = {
                medicalProcedureIds: selectedProcedures
            }

            await axios.post("/api/configurations/"+id+"/procedures",data)

            setLoading(false)
            toast.success("Configuración actualizada exitosamente.",{id:"1"})
            router.push("/admin/configuraciones/configuraciones")
        }catch(e:any){
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <>
            <NavBarConfig selected="configuraciones" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Procedimientos médicos relacionados a '{configuration.procedure.shortForm}{" - "}{configuration.anesthesia.shortForm}{" - "}{configuration.stay.shortForm}'</h1>
                
                <button onClick={()=>router.push("/admin/configuraciones/configuraciones")} className="underline cursor-pointer disabled:cursor-not-allowed" disabled={loading}>Regresar</button>

                <button onClick={fetchPost} className="underline cursor-pointer disabled:cursor-not-allowed" disabled={loading}>Guardar cambios</button>

                <h1 className="font-bold">Seleccionar procedimientos médicos especificos</h1>
                <div className="p-2 border">
                    {medicalProcedures.map((mp)=>(
                        <button onClick={()=>toggleMedicalProcedure(mp.id)} key={mp.id} disabled={loading} className="cursor-pointer flex flex-row gap-1 disabled:cursor-not-allowed">
                            <input type="checkbox" className="cursor-pointer" readOnly checked={selectedProcedures.includes(mp.id)}/>
                            <p>{mp.name}</p>
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default page