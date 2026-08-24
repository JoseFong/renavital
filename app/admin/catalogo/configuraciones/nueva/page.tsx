"use client"
import { Anesthesia, Category, Procedure, Stay } from "@/app/generated/prisma/client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const [loading,setLoading] = useState(false)

    const [procedures, setProcedures] = useState<Procedure[]>([])
    const [anesthesias, setAnesthesias] = useState<Anesthesia[]>([])
    const [stays, setStays] = useState<Stay[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const [procedureId, setProcedureId] = useState("-1")
    const [anesthesiaId, setAnesthesiaId] = useState("-1")
    const [stayId, setStayId] = useState("-1")

    const [selectedCategories, setSelectedCategories] = useState<number[]>([])

    function toggleSelect(id: number) {
        let aux = [...selectedCategories]

        if (aux.includes(id)) {
            aux = aux.filter((a: number) => a !== id)
        } else {
            aux.push(id)
        }

        setSelectedCategories(aux)
    }

    async function fetchProcedures() {
        try {
            const response = await axios.get("/api/procedures")
            setProcedures(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchAnesthesias() {
        try {
            const response = await axios.get("/api/anesthesias")
            setAnesthesias(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    async function fetchStays() {
        try {
            const response = await axios.get("/api/stays")
            setStays(response.data)
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
            const response = await axios.get("/api/categories")
            setCategories(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(() => {
        fetchAnesthesias()
        fetchProcedures()
        fetchStays()
        fetchCategories()
    }, [])
    
    function reset(){
        setAnesthesiaId("-1")
        setSelectedCategories([])
        setProcedureId("-1")
        setStayId("-1")
    }

    async function fetchCreate() {
        try {
            setLoading(true)

            if(procedureId==="-1") throw new Error("Seleccione un procedimiento.")
            if(anesthesiaId==="-1") throw new Error("Seleccione un tipo de anestesia.")
            if(stayId==="-1") throw new Error("Seleccione un tipo de estancia.")

            if(selectedCategories.length===0) throw new Error("Seleccione por lo menos un concepto.")

            const selectedProcedure = procedures.find((p:Procedure)=>p.id===Number(procedureId))
            if(!selectedProcedure) return

            const selectedAnesthesia = anesthesias.find((a:Anesthesia)=>a.id===Number(anesthesiaId))
            if(!selectedAnesthesia) return

            const selectedStay = stays.find((s:Stay)=>s.id===Number(stayId))
            if(!selectedStay) return

            const code = selectedProcedure.code+"-"+selectedAnesthesia.code+"-"+selectedStay.code

            const data = {
                code: code,
                procedureId: Number(procedureId),
                anesthesiaId: Number(anesthesiaId),
                stayId: Number(stayId),
                selectedCategories: selectedCategories
            }

            await axios.post("/api/configurations",data)

            setLoading(false)
            toast.success("Configuración guardada exitosamente.")
            reset()
        } catch (e: any) {
            setLoading(false)
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    return (
        <>
            <NavBarCatalogue selected="Configuraciones" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold">Nueva configuración</h1>
                <div className="flex flex-row gap-10">
                    <div className="flex flex-col gap-1">
                        <label>Procedimiento</label>
                        <select value={procedureId} onChange={(e) => setProcedureId(e.target.value)}>
                            <option value="-1">Seleccionar procedimiento</option>
                            {procedures.map((p: Procedure) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <label>Tipo de anestesia</label>
                        <select value={anesthesiaId} onChange={(e) => setAnesthesiaId(e.target.value)}>
                            <option value="-1">Seleccionar tipo de anestesia</option>
                            {anesthesias.map((a: Anesthesia) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                        <label>Estancia</label>
                        <select value={stayId} onChange={(e) => setStayId(e.target.value)}>
                            <option value="-1">Seleccionar tipo de estancia</option>
                            {stays.map((s: Stay) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Conceptos</label>
                        {categories.map((c: Category) => (
                            <div key={c.id} className="flex flex-row gap-1">
                                <input type="checkbox" checked={selectedCategories.includes(c.id)} onChange={() => toggleSelect(c.id)} />
                                {c.name}
                            </div>
                        ))}
                    </div>
                </div>
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer">Registrar</button>
            </div>
        </>
    )
}

export default page