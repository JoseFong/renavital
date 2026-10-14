"use client"
import { Specialty } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import { MedicalProcedureInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [procedure, setProcedure] = useState<MedicalProcedureInfo>()
    const [specialties, setSpecialties] = useState<Specialty[]>([])

    const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([])

    async function fetchProcedure() {
        try {
            const response = await axios.get("/api/medicalProcedures/" + id)
            setProcedure(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchSpecialties() {
        try {
            const response = await axios.get("/api/specialties")
            setSpecialties(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        fetchProcedure()
        fetchSpecialties()
    }, [])

    useEffect(() => {
        if (procedure) {
            setSelectedSpecialties(procedure.medicalProcedureSpecialties.map((s) => s.specialtyId))
        }
    }, [procedure])


    if (!procedure) return null

    let avSpecialtiesResults = specialties.filter((s) => !selectedSpecialties.includes(s.id))
    let selSpecialtiesResults = specialties.filter((s) => selectedSpecialties.includes(s.id))

    function toggleSelection(id: number) {
        let aux = [...selectedSpecialties]

        if (aux.includes(id)) {
            aux = aux.filter((a) => a !== id)
        } else {
            aux.push(id)
        }

        setSelectedSpecialties(aux)
    }

    function selectAll() {
        if (selectedSpecialties.length === specialties.length) {
            setSelectedSpecialties([])
        } else {
            setSelectedSpecialties(specialties.map((s) => s.id))
        }
    }

    async function fetchPost() {
        try {
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            const data = {
                specialtyIds: selectedSpecialties
            }

            await axios.post("/api/medicalProcedures/"+id+"/specialties",data)

            setLoading(false)
            toast.success("Procedimiento asignado a especialidades exitosamente.",{id:"1"})
            router.push("/admin/catalogo/procedimientos")
        } catch (e: any) {
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <>
            <NavBarCatalogue selected="procedimientos" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Especialidades relacionadas al procedimiento '{procedure.name}'</h1>

                <button onClick={()=>router.push("/admin/catalogo/procedimientos")} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>
                <button onClick={fetchPost} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Guardar cambios</button>

                <button onClick={selectAll} className="underline cursor-pointer disabled:cursor-not-allowed" disabled={loading}>
                    {selectedSpecialties.length === specialties.length ? "Deseleccionar todos" : "Seleccionar todos"}
                </button>

                <div className="flex flex-row gap-10">

                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Especialidades disponibles</h1>
                        <div className="flex flex-col">
                            {avSpecialtiesResults.map((s, index) => (
                                <button onClick={() => toggleSelection(s.id)} disabled={loading} key={s.id} className={`p-1 cursor-pointer hover:bg-zinc-200 disabled:cursor-not-allowed border ${index % 2 === 0 && "bg-zinc-100"} ${index === 0 && "rounded-t-md"} ${index === avSpecialtiesResults.length - 1 && "rounded-b-md"}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Especialidades seleccionadas</h1>
                        <div className="flex flex-col">
                            {selSpecialtiesResults.map((s, index) => (
                                <button onClick={() => toggleSelection(s.id)} disabled={loading} key={s.id} className={`p-1 cursor-pointer hover:bg-zinc-200 disabled:cursor-not-allowed border ${index % 2 === 0 && "bg-zinc-100"} ${index === 0 && "rounded-t-md"} ${index === selSpecialtiesResults.length - 1 && "rounded-b-md"}`}>
                                    {s.name}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>


            </div>
        </>
    )
}

export default page