"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import DeleteRuleModal from "@/components/catalogue/Rules/DeleteRuleModal"
import { RuleInfo } from "@/lib/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const router = useRouter()

    const loaded = useRef(false)

    const [loading,setLoading] = useState(false)
    const [rules,setRules] = useState<RuleInfo[]>([])

    const [selectedRule,setSelectedRule] = useState<RuleInfo|null>(null)
    const [isDeleteRuleOpen,setIsDeleteRuleOpen] = useState(false)

    async function fetchRules() {
        try {
            setLoading(true)
            const response = await axios.get("/api/rules")
            setRules(response.data)
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
        if(loaded.current) return
        fetchRules()
        loaded.current=true
    },[])

    return (
        <>
            <NavBarCatalogue selected={"reglas"} />
            <div className="p-5 flex flex-col gap-1">
                <h1 className="font-bold">Reglas</h1>
                <table>
                    <thead>
                        <tr>
                            <th className="border p-1">Id</th>
                            <th className="border p-1">Disparador</th>
                            <th className="border p-1">Fuente</th>
                            <th className="border p-1">Tipo</th>
                            <th className="border p-1">Afecta</th>
                            <th className="border p-1">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rules.map((r:RuleInfo)=>(
                            <tr key={r.id}>
                                <td className="border p-1">{r.id}</td>
                                <td className="border p-1">{r.triggerType}</td>
                                <td className="border p-1">
                                    {r.categorySource && r.categorySource.name}
                                    {r.productSource && r.productSource.name}
                                </td>
                                <td className="border p-1">{r.type}</td>
                                <td className="border p-1">
                                    {r.ruleTargets.length}
                                </td>
                                <td className="border p-1">
                                    <button onClick={()=>router.push("/admin/catalogo/reglas/"+r.id)} className="underline cursor-pointer">Detalles</button>
                                    {" "}
                                    <button onClick={()=>{setSelectedRule(r);setIsDeleteRuleOpen(true)}} className="underline cursor-pointer">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => router.push("/admin/catalogo/reglas/nueva")} className="underline cursor-pointer">Agregar</button>
            </div>
            {selectedRule && <>
                <DeleteRuleModal open={isDeleteRuleOpen} setOpen={setIsDeleteRuleOpen} rule={selectedRule} reload={fetchRules}/>
            </>}
        </>
    )
}

export default page