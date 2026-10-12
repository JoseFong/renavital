"use client"
import { Anesthesia, Procedure, Stay } from "@/app/generated/prisma/client"
import CreateMedicalProcedure from "@/components/catalogue/MedicalProcedures/CreateMedicalProcedure"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import { ConfigurationInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const [loading, setLoading] = useState(false)

    const [configurations, setConfigurations] = useState<ConfigurationInfo[]>([])
    const [procedures, setProcedures] = useState<Procedure[]>([])
    const [anesthesias, setAnesthesias] = useState<Anesthesia[]>([])
    const [stays, setStays] = useState<Stay[]>([])

    const [name, setName] = useState("")
    const [code, setcode] = useState("")
    const [selectedConfigurations, setSelectedConfigurations] = useState<number[]>([])

    const [selectedProcedure, setSelectedProcedure] = useState("")
    const [selectedAnesthesia, setSelectedAnesthesia] = useState("")
    const [selectedStay, setSelectedStay] = useState("")

    const [isConfirmOpen,setIsConfirmOpen] = useState(false)

    async function fetchInformation() {
        try {
            const response = await axios.get("/api/medicalProcedures/create")
            setConfigurations(response.data.configurations)
            setProcedures(response.data.procedures)
            setAnesthesias(response.data.anesthesias)
            setStays(response.data.stays)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchInformation()
        loaded.current = true
    }, [])

    function toggleSelection(id: number) {
        let aux = [...selectedConfigurations]
        if (selectedConfigurations.includes(id)) {
            aux = selectedConfigurations.filter((sc) => sc !== id)
        } else {
            aux.push(id)
        }
        setSelectedConfigurations(aux)
    }

    let configurationResults = [...configurations]
    if (selectedProcedure !== "") {
        configurationResults = configurationResults.filter((cr) => cr.procedureId === Number(selectedProcedure))
    }
    if (selectedAnesthesia !== "") {
        configurationResults = configurationResults.filter((cr) => cr.anesthesiaId === Number(selectedAnesthesia))
    }
    if (selectedStay !== "") {
        configurationResults = configurationResults.filter((cr) => cr.stayId === Number(selectedStay))
    }

    function selectAll() {
        let aux = [...selectedConfigurations]

        if (configurationResults.every((cr) => selectedConfigurations.includes(cr.id))) {
            configurationResults.forEach((cr) => {
                aux = aux.filter((id) => id !== cr.id)
            })
        } else {
            configurationResults.forEach((cr) => {
                if (!selectedConfigurations.includes(cr.id)) {
                    aux.push(cr.id)
                }
            })
        }

        setSelectedConfigurations(aux)
    }

    function fetchCreate(){
        if(code.trim()==="" || name.trim()===""){
            toast.error("Complete todos los campos obligatorios.")
            return
        }

        setIsConfirmOpen(true)
    }

    return (
        <>
            <NavBarCatalogue selected="procedimientos" />
            <div className="flex flex-col gap-1 p-5">
                <h1 className="font-bold text-lg">Nuevo procedimiento médico específico</h1>
                <button disabled={loading} onClick={fetchCreate} className="underline cursor-pointer disabled:cursor-not-allowed">Registrar</button>
                <button disabled={loading} onClick={() => router.push("/admin/catalogo/procedimientos")} className="underline cursor-pointer disabled:cursor-not-allowed">Regresar</button>
                <label className="font-bold">Código<span className="text-red-500 font-bold">*</span></label>
                <input placeholder="Código" value={code} onChange={(e) => setcode(e.target.value.toUpperCase())} />
                <label className="font-bold">Nombre<span className="text-red-500 font-bold">*</span></label>
                <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} />

                <label className="font-bold">Agregar configuraciones</label>

                <p>({selectedConfigurations.length}) {selectedConfigurations.length === 1 ? "configuración seleccionada." : "configuraciones seleccionadas."}</p>

                <div className="flex flex-row gap-5">
                    <div className="flex flex-col gap-1 border p-1">
                        <label className="font-bold">Tipo de procedimiento</label>
                        <select value={selectedProcedure} onChange={(e) => setSelectedProcedure(e.target.value)}>
                            <option value={""}>-</option>
                            {procedures.map((p) => (
                                <option key={p.id} value={p.id}>{p.shortForm}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 p-1 border">
                        <label className="font-bold">Tipo de anestesia</label>
                        <select value={selectedAnesthesia} onChange={(e) => setSelectedAnesthesia(e.target.value)}>
                            <option value={""}>-</option>
                            {anesthesias.map((a) => (
                                <option key={a.id} value={a.id}>{a.shortForm}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 p-1 border">
                        <label className="font-bold">Tipo de estancia</label>
                        <select value={selectedStay} onChange={(e) => setSelectedStay(e.target.value)}>
                            <option value={""}>-</option>
                            {stays.map((s) => (
                                <option key={s.id} value={s.id}>{s.shortForm}</option>
                            ))}
                        </select>
                    </div>
                </div>  

                <div className="flex flex-col p-2 border">
                    {configurationResults.length > 0 ?
                        <button disabled={loading} onClick={selectAll} className="underline cursor-pointer disabled:cursor-pointer">
                            {configurationResults.every((cr)=>selectedConfigurations.includes(cr.id)) ? "Deseleccionar todas" : "Seleccionar todas"}
                        </button>
                        :
                        <p>No se encontraron resultados</p>
                    }
                    {configurationResults.map((cr) => (
                        <button disabled={loading} key={cr.id} onClick={() => toggleSelection(cr.id)} className="flex flex-row gap-1 hover:cursor-pointer disabled:cursor-not-allowed">
                            <input type="checkbox" checked={selectedConfigurations.includes(cr.id)} readOnly />
                            {cr.procedure.shortForm}{" · "}{cr.anesthesia.shortForm}{" · "}{cr.stay.shortForm}
                        </button>
                    ))}
                </div>
            </div>
            <CreateMedicalProcedure open={isConfirmOpen} setOpen={setIsConfirmOpen} name={name} code={code} selectedConfigurations={selectedConfigurations}/>
        </>
    )
}

export default page