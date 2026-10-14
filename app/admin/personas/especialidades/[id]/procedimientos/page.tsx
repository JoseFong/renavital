"use client"
import { MedicalProcedure } from "@/app/generated/prisma/client"
import NavBarPersons from "@/components/persons/PersonsNavBar"
import { normalizeText } from "@/lib/normalizeText"
import { SpecialtyInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [specialty, setSpecialty] = useState<SpecialtyInfo>()
    const [procedures, setProcedures] = useState<MedicalProcedure[]>([])

    const [selectedProcedures, setSelectedProcedures] = useState<number[]>([])

    const [selectedProceduresSearch, setSelectedProceduresSearch] = useState("")
    const [avProcedureSearch, setAvProcedureSearch] = useState("")

    async function fetchSpecialty() {
        try {
            const response = await axios.get("/api/specialties/" + id)
            setSpecialty(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    async function fetchProcedures() {
        try {
            const response = await axios.get("/api/medicalProcedures")
            setProcedures(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        fetchSpecialty()
        fetchProcedures()
    }, [])

    useEffect(() => {
        if (procedures && specialty) {
            setSelectedProcedures(specialty.medicalProcedureSpecialties.map((mps) => mps.medicalProcedureId))
        }
    }, [procedures, specialty])

    if (!specialty) return null

    let avProcedureResults = procedures.filter((p) => !selectedProcedures.includes(p.id))
    if (avProcedureSearch.trim() !== "") {
        let search = normalizeText(avProcedureSearch)
        avProcedureResults = avProcedureResults.filter((p) => normalizeText(p.name).includes(search))
    }

    let selProcedureResults = procedures.filter((p) => selectedProcedures.includes(p.id))
    if (selectedProceduresSearch.trim() !== "") {
        let search = normalizeText(selectedProceduresSearch)
        selProcedureResults = selProcedureResults.filter((p) => normalizeText(p.name).includes(search))
    }

    function toggleProcedure(id: number) {
        let aux = [...selectedProcedures]

        if (aux.includes(id)) {
            aux = aux.filter((a) => a !== id)
        } else {
            aux.push(id)
        }

        setSelectedProcedures(aux)
    }


    function selectAll(){
        if(selectedProcedures.length===procedures.length){
            setSelectedProcedures([])
        }else{
            setSelectedProcedures(procedures.map((p)=>p.id))
        }
    }

    async function fetchPost() {
        try {
            setLoading(true)
            toast.loading("Cargando...",{id:"1"})

            const data = {
                medicalProcedureIds: selectedProcedures
            }

            await axios.post("/api/specialties/"+id+"/procedures",data)

            setLoading(false)
            toast.success("Procedimientos asignados exitosamente.",{id:"1"})
            router.push("/admin/personas/especialidades")
        } catch (e: any) {
            setLoading(false)
            toast.error(e.response?.data?.message ?? e.message,{id:"1"})
        }
    }

    return (
        <>
            <NavBarPersons selected="especialidades" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Procedimientos de la especialidad '{specialty.name}'</h1>
                Gestionar procedimientos médicos pertenecientes a la especialidad
                <button onClick={() => router.push("/admin/personas/especialidades")} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>
                <button onClick={fetchPost} disabled={loading} className="underline cursor-pointer disabled:cursor-not-allowed">Guardar cambios</button>
                <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Procedimientos disponibles</h1>
                        <input placeholder="Buscar procedimiento" value={avProcedureSearch} onChange={(e) => setAvProcedureSearch(e.target.value)} />
                        <div className="flex flex-col">
                            {avProcedureResults.map((p, index) => (
                                <button
                                    onClick={() => toggleProcedure(p.id)}
                                    disabled={loading}
                                    className={`p-1 border hover:bg-zinc-200 cursor-pointer disabled:cursor-not-allowed ${index === 0 && "rounded-t-md"} ${index === avProcedureResults.length - 1 && "rounded-b-md"} ${index % 2 === 0 && "bg-zinc-100"}`}
                                    key={p.id}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Procedimientos seleccionados</h1>
                        <input placeholder="Buscar procedimiento" value={selectedProceduresSearch} onChange={(e) => setSelectedProceduresSearch(e.target.value)} />
                        <div className="flex flex-col">
                            {selProcedureResults.map((p, index) => (
                                <button
                                    onClick={() => toggleProcedure(p.id)}
                                    disabled={loading}
                                    className={`p-1 border hover:bg-zinc-200 cursor-pointer disabled:cursor-not-allowed ${index === 0 && "rounded-t-md"} ${index === selProcedureResults.length - 1 && "rounded-b-md"} ${index % 2 === 0 && "bg-zinc-100"}`}
                                    key={p.id}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={selectAll} className="underline cursor-pointer disabled:cursor-not-allowed" disabled={loading}>
                    {selectedProcedures.length===procedures.length ? "Deseleccionar todos" : "Seleccionar todos"}
                </button>
            </div>
        </>
    )
}

export default page