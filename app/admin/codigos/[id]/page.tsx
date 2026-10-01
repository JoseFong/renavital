"use client"
import CodesNavBar from "@/components/codes/CodesNavBar"
import { formatDate } from "@/lib/formatDate"
import { CodeInfo } from "@/lib/types"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

function page() {
    const loaded = useRef(false)

    const params = useParams()
    const id = params.id

    const router = useRouter()

    const [code, setCode] = useState<CodeInfo>()

    async function fetchCode() {
        try {
            const response = await axios.get("/api/codes/" + id)
            setCode(response.data)
        } catch (e: any) {
            toast.error(e.response?.data?.message ?? e.message)
        }
    }

    useEffect(() => {
        if (loaded.current) return
        fetchCode()
        loaded.current = true
    }, [])

    return (
        <>
            <CodesNavBar selected="codigos" />
            <div className="flex flex-col gap-1 p-5">
                <button onClick={() => router.push("/admin/codigos")} className="underline cursor-pointer">Regresar a códigos</button>
                <h1 className="font-bold text-lg">Información del código '{code?.code}'</h1>
                <p>[{code?.valid ? "🟢 ACTIVO" : "🔴 INACTIVO"}]</p>
                <div className="flex flex-row gap-2">
                    <button onClick={()=>router.push("/admin/codigos/"+id+"/editar")} className="underline cursor-pointer">Editar</button>
                    <button className="underline cursor-pointer">Gestionar Personas</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 border flex flex-col gap-1">
                        <h1 className="font-bold">Descuento</h1>
                        <p>
                            {code?.discountType === "FIXED" ? "$" + code.discount.toFixed(2) : code?.discount + "%"}
                        </p>
                    </div>
                    <div className="p-2 border flex flex-col gap-1">
                        <h1 className="font-bold">Aplica sobre</h1>
                        <p>
                            {code?.appliesToTotal ? "Total" : "Subtotal"}
                        </p>
                    </div>
                    <div className="p-2 border flex flex-col gap-1">
                        <h1 className="font-bold">Tipo de uso</h1>
                        <p>
                            {code?.singleUse ? "Un solo uso" : "Múltiples usos"}
                        </p>
                    </div>
                    <div className="p-2 border flex flex-col gap-1">
                        <h1 className="font-bold">Máximo de usos</h1>
                        <p>
                            {code?.maxUses} {code?.maxUses===1 ? "uso" : "usos"} por persona.
                        </p>
                    </div>
                </div>
                <div className="p-2 border flex flex-col gap-1">
                    <h1 className="font-bold">Vigencia</h1>
                    <p>
                        {formatDate(code?.startDate+"")}{" - "}{formatDate(code?.endDate+"")}
                    </p>
                </div>
                <h1 className="font-bold text-lg">Personas asignadas</h1>
                <p>Pacientes ({code?.codeUsages.filter((c)=>c.patient).length})</p>
                <table>
                    <thead>
                        <tr>
                            <th className="p-1 border">Paciente</th>
                            <th className="p-1 border">Uso</th>
                            <th className="p-1 border">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {code?.codeUsages.filter((cu)=>cu.patient).map((cu)=>(
                            <tr key={cu.id}>
                                <td className="border p-1">{cu.patient.firstName}{" "}{cu.patient.lastName}{" "}{cu.patient.secondLastName??""}</td>
                                <td className="border p-1">
                                    {cu.numberOfUses}{" / "}{code.maxUses}
                                </td>
                                <td className="border p-1">
                                    {cu.valid ? "Activo" : "Agotado"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>Médicos ({code?.codeUsages.filter((c)=>c.doctor).length})</p>
                <table>
                    <thead>
                        <tr>
                            <th className="p-1 border">Médico</th>
                            <th className="p-1 border">Uso</th>
                            <th className="p-1 border">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {code?.codeUsages.filter((cu)=>cu.doctor).map((cu)=>(
                            <tr key={cu.id}>
                                <td className="border p-1">{cu.doctor.firstName}{" "}{cu.doctor.lastName}{" "}{cu.doctor.secondLastName??""}</td>
                                <td className="border p-1">
                                    {cu.numberOfUses}{" / "}{code.maxUses}
                                </td>
                                <td className="border p-1">
                                    {cu.valid ? "Activo" : "Agotado"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default page