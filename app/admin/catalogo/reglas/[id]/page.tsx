"use client"
import NavBarCatalogue from "@/components/catalogue/NavBarCatalogue"
import DeleteRuleModal from "@/components/catalogue/Rules/DeleteRuleModal"
import { RuleInfo, RuleTargetInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const params = useParams()
    const id = params.id

    const loaded = useRef(false)

    const router = useRouter()

    const [rule, setRule] = useState<RuleInfo | null>(null)

    const [isDeleteOpen,setIsDeleteOpen] = useState(false)

    async function fetchRule() {
        try {
            const response = await axios.get("/api/rules/" + id)
            setRule(response.data)
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    useEffect(() => {
        if(loaded.current) return
        fetchRule()
        loaded.current=true
    }, [])

    function reload(){
        router.push("/admin/catalogo/reglas")
    }

    return (
        <>
            <NavBarCatalogue selected={"reglas"} />
            <div className="p-5 flex flex-col gap-1">
                <h1 className="font-bold text-lg">Regla #{id}</h1>
                {rule &&
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">Tipo de disparador</h1>
                        {rule.triggerType}
                        <h1 className="font-bold">Tipo de regla</h1>
                        {rule.type}
                        {rule.productSource && <h1 className="font-bold">Producto disparador</h1>}
                        {rule.productSource && rule.productSource.name}
                        {rule.categorySource && <h1 className="font-bold">Categoría disparador</h1>}
                        {rule.categorySource && rule.categorySource.name}
                        <h1 className="font-bold">Productos afectados</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th className="border p-1">Id</th>
                                    <th className="border p-1">Producto</th>
                                    <th className="border p-1">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rule.ruleTargets.map((rt:RuleTargetInfo)=>(
                                    <tr key={rt.productId}>
                                        <td className="border p-1">{rt.productId}</td>
                                        <td className="border p-1">{rt.product.name}</td>
                                        <td className="border p-1">{rt.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                }
                <button onClick={() => router.push("/admin/catalogo/reglas")} className="underline cursor-pointer">Regresar</button>
                <button onClick={()=>setIsDeleteOpen(true)} className="underline cursor-pointer">Eliminar</button>
            </div>
            {rule && <DeleteRuleModal open={isDeleteOpen} setOpen={setIsDeleteOpen} rule={rule} reload={reload}/>}
        </>
    )
}

export default page