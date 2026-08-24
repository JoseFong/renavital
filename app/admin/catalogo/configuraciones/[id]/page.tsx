"use client"

import { Category, Configuration } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ConfigurationInfo } from "@/lib/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {

    const params = useParams()
    const id = params.id

    const router = useRouter()

    const [configuration,setConfiguration] = useState<ConfigurationInfo|null>(null)
    const [categories,setCategories] = useState([])

    async function fetchConfiguration() {
        try {
            const response = await axios.get("/api/configurations/"+id)
            setConfiguration(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchCategories() {
        try {
            const response = await axios.get("/api/configurations/"+id+"/categories")
            setCategories(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(()=>{
        fetchCategories()
        fetchConfiguration()
    },[])

    return (
        <>
            <NavBarCatalogue selected="Configuraciones" />
            <div className="flex flex-col gap-1 p-5">
                Información de configuración {configuration?.code}
                <label>Código</label>
                {configuration?.code}
                <label>Procedimiento</label>
                {configuration?.procedure.name}
                <label>Anestesia</label>
                {configuration?.anesthesia.name}
                <label>Estancia</label>
                {configuration?.stay.name}
                <label>Categorias</label>
                {categories.map((c:Category)=>(
                    <p key={c.id}>{c.name}</p>
                ))}
                <button onClick={()=>router.push("/admin/catalogo/configuraciones")} className="underline cursor-pointer">Regresar</button>
            </div>
        </>
    )
}

export default page